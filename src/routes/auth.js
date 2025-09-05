import express from 'express';
import { register, login } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../utils/validator.js';
import { validationResult } from 'express-validator';


const router = express.Router();


// Register
router.post('/register', registerValidation, async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
return register(req, res);
});


// Login
router.post('/login', loginValidation, async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
return login(req, res);
});


export default router;