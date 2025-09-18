import { body } from 'express-validator';

const testCasesValidator = () => {
    return [
        body('stdin')
            .isArray()
            .withMessage('stdin must be an array')
            .custom((value) => value.length > 0)
            .withMessage('stdin array must not be empty'),
        body('expected_outputs')
            .isArray()
            .withMessage('expected_outputs must be an array')
            .custom((value, { req }) => {
                return (
                    Array.isArray(req.body.stdin) &&
                    value.length === req.body.stdin.length
                );
            })
            .withMessage('expected_outputs must have the same length as stdin'),
    ];
};

export {
    testCasesValidator
}