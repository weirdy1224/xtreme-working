import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/async-handler.js';
import { ErrorCodes } from '../utils/constants.js';
import { ApiError } from '../utils/api-error.js';
import { db } from '../libs/db.js';

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    

    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        throw new ApiError(401, 'Unauthorized request', {
            code: ErrorCodes.USER_NOT_LOGGED_IN,
        });
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired access token', {
            code: ErrorCodes.INVALID_ACCESS_TOKEN,
        });
    }

    if (!decodedToken?.id || typeof decodedToken.id !== 'string') {
        throw new ApiError(401, 'Malformed token payload', {
            code: ErrorCodes.INVALID_ACCESS_TOKEN,
        });
    }

    const user = await db.user.findUnique({
        where: { id: decodedToken.id },
    });

    if (user) {
        delete user.password;
    }

    if (!user) {
        throw new ApiError(401, 'User not found', {
            code: ErrorCodes.USER_NOT_REGISTERED,
        });
    }

    req.user = user;

    next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            role: true,
        },
    });

    if (!user || user.role !== 'ADMIN') {
        throw new ApiError(403, 'Admin access only', {
            code: ErrorCodes.UNAUTHORIZED_ACCESS,
        });
    }
    next();
});

export const verifyOAuthTempToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.tempToken;

    let token;

    // Priority 1: Bearer token from Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // Priority 2: HTTP-only cookie fallback
    else if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        throw new ApiError(
            401,
            'Temporary token missing for profile completion',
            {
                code: ErrorCodes.TOKEN_MISSING,
            }
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.TEMP_TOKEN_SECRET);
        req.tempUser = decoded; // Attach to req for further use
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired temporary token', {
            code: ErrorCodes.TOKEN_INVALID,
        });
    }
});
