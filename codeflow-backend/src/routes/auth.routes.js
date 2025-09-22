import { Router } from 'express';

import {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    getUser,
    refreshAccessToken,
    resetPasswordRequest,
    resetPassword,
    logoutUser,
    updateUserDetails,
    updateUserAvatar,
} from '../controllers/auth.controllers.js';

import { validate } from '../middlewares/validator.middlewares.js';

import {
    userRegistrationValidator,
    verifyEmailValidator,
    emailOnlyValidator,
    userLoginValidator,
    cookieBasedTokenValidator,
    resetPasswordValidator,
    updateUserValidator,
    userIdValidator,
} from '../validators/index.js';

import {
    isLoggedIn,
    isAdmin,
} from '../middlewares/auth.middlewares.js';

import { upload } from '../middlewares/multer.middlerwares.js';
import { catchMulterError } from '../utils/catchMulterErrors.js';

const router = Router();

router
    .route('/register')
    .post(
        // catchMulterError(upload.single('avatar'), false),
        userRegistrationValidator(),
        validate,
        registerUser
    );
router
    .route('/verifyEmail/:token')
    .get(verifyEmailValidator(), validate, verifyEmail);
router
    .route('/resendVerifyEmail')
    .post(emailOnlyValidator(), validate, resendVerificationEmail);
router.route('/login').post(userLoginValidator(), validate, loginUser);
router.route('/profile').get(isLoggedIn, getUser);
router
    .route('/logout')
    .get(cookieBasedTokenValidator(), validate, isLoggedIn, logoutUser);
router
    .route('/refreshAccessToken')
    .get(cookieBasedTokenValidator(), validate, isLoggedIn, refreshAccessToken);
router
    .route('/forgotPassword')
    .post(emailOnlyValidator(), validate, resetPasswordRequest);
router
    .route('/resetPassword/:token')
    .post(resetPasswordValidator(), validate, resetPassword);
router
    .route('/updateProfile')
    .post(updateUserValidator(), validate, isLoggedIn, updateUserDetails);

router
    .route('/updateAvatar')
    .patch(
        isLoggedIn,
        catchMulterError(upload.single('avatar')),
        updateUserAvatar
    );

router
    .route('/:userId')
    .get(userIdValidator(), isLoggedIn, isAdmin, validate, getUser)
    .patch(
        [userIdValidator(), updateUserValidator()],
        isLoggedIn,
        isAdmin,
        validate,
        updateUserDetails
    );

export default router;
