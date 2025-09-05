import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { addBankAccount, addMoneyToBankAccount, deleteBankAccount, getBankAccounts } from '../controllers/bankAccController.js';

const router = express.Router();

// Add new bank account
router.post('/add', authenticate, addBankAccount);

router.post('/add-money', authenticate, addMoneyToBankAccount);

// Get all accounts
router.get('/getall', authenticate, getBankAccounts);

// Delete an account
router.delete('/delete/:id', authenticate, deleteBankAccount);

export default router;
