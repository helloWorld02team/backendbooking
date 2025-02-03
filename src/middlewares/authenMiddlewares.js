import { check, validationResult } from 'express-validator';

export const validateLogin = [
    check('userEmail').isEmail().withMessage('Invalid email format'),
    check('userPassword').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors.errors[0].msg)
            return res.status(400).json({ errors: errors.errors[0].msg });
        }
        next();
    }
];