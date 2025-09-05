import { body, query } from 'express-validator';


export const registerValidation = [
body('full_name').isLength({ min: 2 }),
body('email').isEmail(),
body('mobile').isLength({ min: 10, max: 15 }),
body('upi_id').isLength({ min: 3 }),
body('password').isLength({ min: 8 })
];


export const loginValidation = [
body('email').isEmail(),
body('password').exists()
];


export const sendMoneyValidation = [
body('to_upi').isString().notEmpty(),
body('amount').isFloat({ gt: 0 }),
body('note').optional().isString().isLength({ max: 200 })
];


export const txHistoryValidation = [
query('from').optional().isISO8601(),
query('to').optional().isISO8601(),
query('status').optional().isIn(['PENDING','SUCCESS','FAILED'])
];