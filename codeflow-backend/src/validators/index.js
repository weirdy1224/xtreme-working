import { body, cookie, param, query } from 'express-validator';

const userRegistrationValidator = () => {
    return [
        body('fullname')
            .trim()
            .notEmpty()
            .withMessage('Fullname is required')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('Fullname is invalid'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
            .normalizeEmail(),
        body('username')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength({ min: 3 })
            .withMessage('username should be at least 3 char')
            .isLength({ max: 13 })
            .withMessage('username cannot exceed 13 char'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password should be at least 6 char'),
    ];
};

const updateUserValidator = () => {
    return [
        body('fullname')
            .optional({ checkFalsy: true })
            .trim()
            .matches(/^[a-zA-Z\s.'-]+$/)
            .withMessage('Fullname is invalid'),

        body('username')
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ min: 3 })
            .withMessage('username should be at least 3 char')
            .isLength({ max: 13 })
            .withMessage('username cannot exceed 13 char')
            .isAlphanumeric()
            .withMessage('Username must contain only letters and numbers'),
    ];
};

const userLoginValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password cannot be empty.')
            .isLength({ min: 6 })
            .withMessage('Password should be at least 6 char'),
    ];
};

const cookieBasedTokenValidator = () => {
    return [
        cookie('refreshToken')
            .exists()
            .withMessage('Refresh token is missing')
            .isString()
            .withMessage('Refresh token must be a string'),
        // .notEmpty().withMessage('Refresh token cannot be empty'),
        cookie('accessToken')
            .optional()
            .isString()
            .withMessage('Access token must be a string'),
    ];
};

const verifyEmailValidator = () => {
    return [
        param('token')
            .exists()
            .withMessage('Token param is required')
            .isString()
            .withMessage('Token must be a string')
            .isLength({ min: 40, max: 80 }) // Typical hex token length (adjust as needed)
            .withMessage('Invalid token format'),
    ];
};

const emailOnlyValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
            .normalizeEmail(),
    ];
};

const userIdValidator = () => {
    return [
        param('userId').trim().isMongoId().withMessage('User id is invalid'),
    ];
};

export {
    userRegistrationValidator,
    updateUserValidator,
    userLoginValidator,
    cookieBasedTokenValidator,
    verifyEmailValidator,
    emailOnlyValidator,
    userIdValidator,
};
