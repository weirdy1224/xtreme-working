import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { ApiError } from './api-error.js';
import { ErrorCodes } from './constants.js';

const comparePassword = async (password, user) => {
    return await bcrypt.compare(password, user.password);
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const generateTemporaryToken = () => {
    const unHashedToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(unHashedToken)
        .digest('hex');
    const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000);

    return [unHashedToken, hashedToken, tokenExpiry];
};

const sanitize = (user) => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
        role: user.role,
    };
};

const generateState = () => {
    return crypto.randomBytes(32).toString('hex');
};

const generateNonce = () => {
    return crypto.randomBytes(32).toString('hex');
};

const getJwksClient = () => {
    return jwksClient({
        jwksUri: process.env.GOOGLE_JWKS_URL,
        cache: true,
        rateLimit: true,
    });
};

const getSigningKey = async (kid) => {
    const client = getJwksClient();

    return new Promise((resolve, reject) => {
        client.getSigningKey(kid, (err, key) => {
            if (err) {
                console.error('Error getting signing key: ', err);
                return reject(err);
            }
            const signingkey = key.getPublicKey();
            resolve(signingkey);
        });
    });
};

const verifyGoogleToken = async (token) => {
    try {
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            throw new ApiError(400, 'Invalid id Token', {
                code: ErrorCodes.INVALID_ID_TOKEN,
            });
        }

        const kid = decoded.header.kid;
        const signingKey = await getSigningKey(kid);

        const verifiedToken = jwt.verify(token, signingKey, {
            algorithms: ['RS256'],
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return verifiedToken;
    } catch (error) {
        console.log('Error verifying token:', error);
        throw new ApiError(400, 'Token verification failed', {
            code: ErrorCodes.UNKNOWN_ERROR,
        });
    }
};

export {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    generateTemporaryToken,
    sanitize,
    generateNonce,
    generateState,
    verifyGoogleToken,
};
