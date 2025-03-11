import { body, validationResult } from 'express-validator';

export const verifyField = [
    body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .notEmpty().withMessage('Email is required'),

body('firstName')
    .isString().trim().withMessage('First name must be a string')
    .notEmpty().withMessage('First name is required'),

body('lastName')
    .isString().trim().withMessage('Last name must be a string')
    .notEmpty().withMessage('Last name is required'),

body('subject')
    .isString().trim().withMessage('Subject must be a string')
    .notEmpty().withMessage('Subject is required'),

body('message')
    .isString().trim().withMessage('Message must be a string')
    .notEmpty().withMessage('Message is required'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
