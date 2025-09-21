import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { asyncHandler } from '../utils/async-handler.js';
import {
    sendMail,
    emailVerificationMailGenContent,
    resetPasswordMailGenContent,
} from '../libs/mail.js';
import { ApiError } from '../utils/api-error.js';
import { ErrorCodes } from '../utils/constants.js';
import { ApiResponse } from '../utils/api-response.js';
import { uploadOnCloudinary } from '../libs/cloudinary.js';
import { db } from '../libs/db.js';
import { Role } from '../generated/prisma/index.js';
import {
    comparePassword,
    generateAccessToken,
    generateNonce,
    generateRefreshToken,
    generateState,
    generateTemporaryToken,
    sanitize,
    verifyGoogleToken,
} from '../utils/auth.utils.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    if (
        [fullname, email, username, password].some(
            (field) => field?.trim() === ''
        )
    ) {
        throw new ApiError(400, 'All fields are required', {
            code: ErrorCodes.MISSING_FIELDS,
        });
    }

    const existingUser = await db.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existingUser) {
        throw new ApiError(400, 'User with email or username already exists', {
            code: ErrorCodes.USER_ALREADY_EXISTS,
        });
    }

    // const avatarLocalPath = req.file?.path;

    // console.log(avatarLocalPath);

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, 'Avatar file is required', {
    //         code: ErrorCodes.AVATAR_NOT_PROVIDED,
    //     });
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await db.user.create({
        data: {
            fullname,
            // avatarUrl: avatar.url,
            email,
            username,
            password,
            role: Role.USER,
        },
    });
    console.log(user);

    if (!user) {
        throw new ApiError(404, 'User not registered', {
            code: ErrorCodes.USER_NOT_REGISTERED,
        });
    }

    const [unHashedToken, hashedToken, tokenExpiry] = generateTemporaryToken();

    await db.user.update({
        where: { id: user.id },
        data: {
            emailVerificationToken: hashedToken,
            emailVerificationTokenExpiry: tokenExpiry,
        },
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${unHashedToken}`;

    await sendMail({
        email: user.email,
        subject: 'Verify your email',
        mailGenContent: emailVerificationMailGenContent(
            user.username,
            verificationUrl
        ),
    });

    const response = new ApiResponse(
        200,
        sanitize(user),
        'User registered successfully. Please verify your email now.'
    );

    return res.status(response.statusCode).json(response);
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError(400, 'Token is missing', {
            code: ErrorCodes.TOKEN_MISSING,
        });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await db.user.findFirst({
        where: {
            emailVerificationToken: hashedToken,
            emailVerificationTokenExpiry: { gt: new Date() },
        },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid Token', {
            code: ErrorCodes.TOKEN_INVALID,
        });
    }

    if (user.emailVerificationTokenExpiry < Date()) {
        throw new ApiError(400, 'Token has expired', {
            code: ErrorCodes.TOKEN_EXPIRED,
        });
    }

    if (user.isVerified) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user.toPublicUserJSON(),
                    'Your email is already verified.'
                )
            );
    }

    await db.user.update({
        where: { id: user.id },
        data: {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationTokenExpiry: null,
        },
    });

    const updatedUser = await db.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            email: true,
            username: true,
            isEmailVerified: true,
            role: true,
        },
    });

    console.log('User is verified');

    const response = new ApiResponse(
        201,
        sanitize(updatedUser),
        'User account is verified'
    );

    return res.status(response.statusCode).json(response);
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(
            400,
            'Account not found. Please verify your email or sign in again',
            {
                code: ErrorCodes.USER_NOT_FOUND,
            }
        );
    }

    if (user.isEmailVerified) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: user.isEmailVerified,
                },
                'Your email is already verified. Please log in'
            )
        );
    }

    const [unHashedToken, hashedToken, tokenExpiry] = generateTemporaryToken();

    await db.user.update({
        where: { id: user.id },
        data: {
            emailVerificationToken: hashedToken,
            emailVerificationTokenExpiry: tokenExpiry,
        },
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${unHashedToken}`;

    await sendMail({
        email: user.email,
        subject: 'Verify your email',
        mailGenContent: emailVerificationMailGenContent(
            user.username,
            verificationUrl
        ),
    });

    const response = new ApiResponse(
        200,
        sanitize(user),
        'Verification email sent successfully, check your registered email inbox'
    );

    return res.status(response.statusCode).json(response);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'All fields are required', {
            code: ErrorCodes.MISSING_FIELDS,
        });
    }

    const user = await db.user.findFirst({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid email or password', {
            code: ErrorCodes.INVALID_CREDENTIALS,
        });
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, 'User not verified', {
            code: ErrorCodes.USER_NOT_VERIFIED,
        });
    }

    const isMatch = await comparePassword(password, user);

    console.log(isMatch);

    if (!isMatch) {
        throw new ApiError(400, 'Invalid password', {
            code: ErrorCodes.PASSWORDS_DO_NOT_MATCH,
        });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log('Refresh Token:', refreshToken);

    await db.user.update({
        where: { id: user.id },
        data: {
            refreshToken,
        },
    });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 3600000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 86400000,
    });
    const response = new ApiResponse(201, sanitize(user), 'Login successful');

    return res.status(response.statusCode).json(response);
});

const getUser = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId || req.user.id;

    if (req.params.userId && req.user.role !== 'admin') {
        throw new ApiError(403, "Forbidden: You cannot view this user's data", {
            code: ErrorCodes.UNAUTHORIZED_ACCESS,
        });
    }

    const user = await db.user.findUnique({
        where: { id: targetUserId },
        select: {
            id: true,
            email: true,
            username: true,
            fullname: true,
            avatarUrl: true,
            isEmailVerified: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new ApiError(400, 'User not found', {
            code: ErrorCodes.USER_NOT_FOUND,
        });
    }

    const response = new ApiResponse(200, user, 'Current User Shown');

    return res.status(response.statusCode).json(response);
});

const logoutUser = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new ApiError(401, 'Not logged in', {
            code: ErrorCodes.LOGOUT_FAILED,
        });
    }

    const refreshDecoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await db.user.findUnique({
        where: {
            id: refreshDecoded.id,
        },
    });

    if (!user) {
        throw new ApiError(401, 'Unauthorized Access', {
            code: ErrorCodes.UNAUTHORIZED_ACCESS,
        });
    }

    await db.user.update({
        where: { id: user.id },
        data: {
            refreshToken: null,
        },
    });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
    };

    res.cookie('accessToken', '', cookieOptions);
    res.cookie('refreshToken', '', cookieOptions);

    const response = new ApiResponse(201, undefined, 'Logged out successfully');

    return res.status(response.statusCode).json(response);
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;


    if (!refreshToken) {
        throw new ApiError(401, 'No refresh token', {
            code: ErrorCodes.REFRESH_TOKEN_MISSING,
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(403, 'Invalid or expired refresh token', {
            code: ErrorCodes.REFRESH_TOKEN_INVALID,
        });
    }

    const user = await db.user.findUnique({
        where: {
            id: decoded?.id,
        },
    });

    if (!user) {
        throw new ApiError(404, 'User not found', {
            code: ErrorCodes.USER_NOT_FOUND,
        });
    }

    console.log(user.refreshToken);

    if (refreshToken !== user?.refreshToken) {
        throw new ApiError(401, 'Refresh token is expired or used', {
            code: ErrorCodes.REFRESH_TOKEN_EXPIRED,
        });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await db.user.update({
        where: { id: user.id },
        data: {
            refreshToken: newRefreshToken,
        },
    });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    };

    res.cookie('accessToken', newAccessToken, options);
    res.cookie('refreshToken', newRefreshToken, options);

    const response = new ApiResponse(
        201,
        { newAccessToken, newRefreshToken },
        'Tokens refreshed'
    );

    return res.status(response.statusCode).json(response);
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await db.user.findUnique({
        where: {
            email,
        },
    });

    console.log(user);

    if (!user) {
        throw new ApiError(401, 'Invalid Email. No user found', {
            code: ErrorCodes.USER_NOT_FOUND,
        });
    }

    const [unHashedToken, hashedToken, tokenExpiry] = generateTemporaryToken();

    await db.user.update({
        where: { id: user.id },
        data: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: tokenExpiry,
        },
    });

    const passwordResetUrl = `${process.env.BASE_URL}api/v1/auth/resetPassword/${unHashedToken}`;

    await sendMail({
        email: user.email,
        subject: 'Password Reset Link',
        mailGenContent: resetPasswordMailGenContent(
            user.username,
            passwordResetUrl
        ),
    });

    const response = new ApiResponse(
        200,
        null,
        'Reset password email sent. Please check your inbox.'
    );

    return res.status(response.statusCode).json(response);
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const { password, confPassword } = req.body;

    if (password !== confPassword) {
        console.log('No match');
        throw new ApiError(400, 'Passwords do not match', {
            code: ErrorCodes.PASSWORDS_DO_NOT_MATCH,
        });
    }

    if (!token) {
        console.log('Token missing');
        throw new ApiError(400, 'Token is missing', {
            code: ErrorCodes.TOKEN_MISSING,
        });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await db.user.findFirst({
        where: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: { gt: new Date() },
        },
    });

    if (!user) {
        console.log('Token invalid');
        throw new ApiError(400, 'Invalid or expired token', {
            code: ErrorCodes.TOKEN_INVALID,
        });
    }

    if (user.forgotPasswordTokenExpiry < Date.now()) {
        console.log('Token expired');
        throw new ApiError(400, 'Token has expired', {
            code: ErrorCodes.TOKEN_EXPIRED,
        });
    }

    const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
            password,
            forgotPasswordToken: null,
            forgotPasswordTokenExpiry: null,
        },
    });

    const response = new ApiResponse(
        201,
        sanitize(updatedUser),
        'Password changed successfully'
    );

    return res.status(response.statusCode).json(response);
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { username, fullname } = req.body;

    const targetUserId = req.params.userId || req.user.id;

    if (req.params.userId && req.user.role !== 'admin') {
        throw new ApiError(
            403,
            'Forbidden: Not authorized to update this user',
            {
                code: ErrorCodes.UNAUTHORIZED_ACCESS,
            }
        );
    }

    const updates = {};

    if (username) {
        const existingUser = await db.user.findFirst({
            where: {
                username,
                id: { not: targetUserId },
            },
        });
        if (existingUser) {
            throw new ApiError(
                400,
                'User with email or username already exists',
                {
                    code: ErrorCodes.USER_ALREADY_EXISTS,
                }
            );
        }
        updates.username = username;
    }

    if (fullname) {
        updates.fullname = fullname;
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, 'At least one field must be provided', {
            code: ErrorCodes.MISSING_FIELDS,
        });
    }

    const updatedUser = await db.user.update({
        where: { id: targetUserId },
        data: updates,
        select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const response = new ApiResponse(
        200,
        updatedUser,
        'Account details updated successfully'
    );

    return res.status(response.statusCode).json(response);
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is missing', {
            code: ErrorCodes.AVATAR_FILE_PATH_NOT_FOUND,
        });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await db.user.update({
        where: { id: req.user?.id },
        data: {
            avatarUrl: avatar.url,
        },
    });

    const response = new ApiResponse(
        200,
        sanitize(user),
        'Avatar image updated successfully'
    );

    return res.status(response.statusCode).json(response);
});

const googleLogin = asyncHandler(async (req, res) => {
    console.log('Google login initiated');

    const token = req.cookies.accessToken;
    if (token) {
        throw new ApiError(
            409,
            "You're already logged in. Logout before logging in again",
            {
                code: ErrorCodes.ALREADY_LOGGED_IN,
            }
        );
    }

    const state = generateState();
    const nonce = generateNonce();

    res.cookie('oauth_state', state, {
        httpOnly: true,
        maxAge: 600000,
        sameSite: 'lax',
    });

    res.cookie('oauth_nonce', nonce, {
        httpOnly: true,
        maxAge: 600000,
        sameSite: 'lax',
    });

    const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=email%20profile%20openid` +
        `&access_type=offline` +
        `&prompt=consent` +
        `&state=${state}` +
        `&nonce=${nonce}`;

    res.redirect(googleAuthUrl);
});

const googleCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;

    const savedState = req.cookies.oauth_state;
    const savedNonce = req.cookies.oauth_nonce;

    res.clearCookie('oauth_state');
    res.clearCookie('oauth_nonce');

    if (!state || !savedState || state !== savedState) {
        throw new ApiError(401, 'Invalid state parameter', {
            code: ErrorCodes.INVALID_OAUTH_STATE,
        });
    }

    const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        null,
        {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                code,
                grant_type: 'authorization_code',
            },
        }
    );

    console.log(tokenResponse);

    const { id_token, access_token, refresh_token } = tokenResponse.data;

    if (!id_token) {
        throw new ApiError(400, 'Missing ID token from Google', {
            code: ErrorCodes.MISSING_ID_TOKEN,
        });
    }

    const decodedToken = await verifyGoogleToken(id_token);

    if (!decodedToken) {
        throw new ApiError(401, 'Invalid ID token', {
            code: ErrorCodes.INVALID_ID_TOKEN,
        });
    }

    if (!decodedToken.nonce || decodedToken.nonce !== savedNonce) {
        throw new ApiError(401, 'Invalid nonce parameter', {
            code: ErrorCodes.INVALID_NONCE,
        });
    }

    const googleProfilePic = decodedToken.picture.replace(
        /=s\d+-c$/,
        '=s256-c'
    );

    let user = await db.user.findUnique({
        where: { email: decodedToken.email },
    });

    if (!user) {
        const tempToken = jwt.sign(
            {
                googleId: decodedToken.sub,
                email: decodedToken.email,
                name: decodedToken.name,
                url: googleProfilePic,
                googleRefreshToken: refresh_token || null,
            },
            process.env.TEMP_TOKEN_SECRET,
            { expiresIn: '5m' }
        );

        res.cookie('tempToken', tempToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 5 * 60 * 1000, // 5 min
        });

        return res.redirect(`${process.env.CLIENT_URL}/complete-profile`);

        // return res.redirect(`${process.env.CLIENT_URL}/complete-profile?token=${tempToken}`);
    } else {
        const updates = {};

        if (!user.googleId) updates.googleId = decodedToken.sub;
        if (refresh_token && user.refreshToken !== refresh_token) {
            updates.refreshToken = refresh_token;
        }

        let updatedUser = user;
        if (Object.keys(updates).length > 0) {
            updatedUser = await db.user.update({
                where: { id: user.id },
                data: updates,
            });
        }

        const accessToken = generateAccessToken(updatedUser);
        const refreshToken = generateRefreshToken(updatedUser);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, // 24 hour
        });

        const response = new ApiResponse(
            200,
            sanitize(updatedUser),
            'Google Login successful'
        );

        return res.status(response.statusCode).json(response);
    }
});

const completeGoogleSignup = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const { email, googleId, name, url, googleRefreshToken } = req.tempUser;

    res.clearCookie('tempToken');

    const existingUser = await db.user.findUnique({
        where: { username },
    });

    if (existingUser)
        throw new ApiError(409, 'Username already taken', {
            code: ErrorCodes.USER_ALREADY_EXISTS,
        });

    const user = await db.user.create({
        data: {
            username,
            email,
            googleId,
            avatarUrl: url,
            refreshToken: googleRefreshToken || null,
        },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 86400000,
    });

    const response = new ApiResponse(
        201,
        sanitize(user),
        'Google Signup completed'
    );

    return res.status(response.statusCode).json(response);
});

const githubLogin = asyncHandler(async (req, res) => {
    console.log('Github Login triggered');
    const token = req.cookies.accessToken;
    if (token) {
        throw new ApiError(
            401,
            'Already logged in. Logout before logging in again',
            {
                code: ErrorCodes.OAUTH_LOGIN_FAILED,
            }
        );
    }

    const state = generateState();
    res.cookie('oauth_state', state, {
        httpOnly: true,
        maxAge: 600000,
        sameSite: 'lax',
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email&state=${state}`;

    res.redirect(githubAuthUrl);
});

const githubCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const savedState = req.cookies.oauth_state;
    res.clearCookie('oauth_state');

    if (!state || !savedState || state !== savedState) {
        throw new ApiError(401, 'Invalid state parameter', {
            code: ErrorCodes.INVALID_OAUTH_STATE,
        });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
        },
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );

    const githubAccessToken = tokenResponse.data.access_token;
    if (!githubAccessToken) {
        throw new ApiError(401, 'No access token received from GitHub', {
            code: ErrorCodes.OAUTH_NO_ACCESS_TOKEN,
        });
    }

    // Get user info from GitHub
    const userInfo = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${githubAccessToken}`,
        },
    });

    const { id, login, email, name, avatar_url } = userInfo.data;

    const userProfilePic =
        avatar_url || `https://github.com/identicons/${login}.png`;

    // GitHub sometimes doesn't return email, so you might need a second call:
    let userEmail = email;
    if (!userEmail) {
        const emails = await axios.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
            },
        });
        const primaryEmail = emails.data.find((e) => e.primary && e.verified);
        userEmail = primaryEmail?.email || `${login}@github.com`;
    }

    // Find or create user
    let user = await db.user.findUnique({
        where: { email: userEmail },
    });
    if (!user) {
        let githubUsername = login;

        const existingUser = await db.user.findUnique({
            where: {
                username: login,
            },
        });

        if (existingUser) {
            const randomSuffix = crypto.randomUUID().slice(0, 5);
            githubUsername = `${login}-${randomSuffix}`;
        }

        user = await db.user.create({
            data: {
                githubId: id,
                username: githubUsername,
                email: userEmail,
                fullname: name || login,
                avatarUrl: userProfilePic,
            },
        });
    } else {
        if (!user.githubId) {
            user.githubId = id;
        }

        if (!user.username) {
            const existingUser = await db.user.findUnique({
                where: {
                    username: login,
                },
            });
            user.username = existingUser
                ? `${login}-${crypto.randomUUID().slice(0, 5)}`
                : login;
        }
    }

    // Generate JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
    });

    const response = new ApiResponse(
        201,
        sanitize(user),
        'GitHub Login successful'
    );

    return res.status(response.statusCode).json(response);
});

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    getUser,
    logoutUser,
    refreshAccessToken,
    resetPasswordRequest,
    resetPassword,
    updateUserDetails,
    updateUserAvatar,
    googleLogin,
    googleCallback,
    completeGoogleSignup,
    githubLogin,
    githubCallback,
};
