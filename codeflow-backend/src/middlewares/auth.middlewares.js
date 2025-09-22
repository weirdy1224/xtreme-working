// lib/auth.middleware.js
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

  if (!decodedToken?.id) {
    throw new ApiError(401, 'Malformed token payload', {
      code: ErrorCodes.INVALID_ACCESS_TOKEN,
    });
  }

  const user = await db.user.findUnique({
    where: { id: decodedToken.id },
  });

  if (!user) {
    throw new ApiError(401, 'User not found', {
      code: ErrorCodes.USER_NOT_REGISTERED,
    });
  }

  // remove sensitive fields
  const { password, ...safeUser } = user;
  req.user = safeUser;

  next();
});

/**
 * ✅ Restrict access to admins
 * - Requires `isLoggedIn` middleware before this
 */
export const isAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw new ApiError(403, 'Admin access only', {
      code: ErrorCodes.UNAUTHORIZED_ACCESS,
    });
  }

  next();
});
