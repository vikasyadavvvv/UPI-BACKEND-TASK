import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { validationResult } from 'express-validator';
import { 
  sendMoney, 
  requestMoney, 
  respondRequest, 
  getHistory, 
  checkBalance, 
  txStatus 
} from '../controllers/transactionController.js';
import { sendMoneyValidation, txHistoryValidation } from '../utils/validator.js';

const router = express.Router();

// Send money via UPI id
router.post('/send', authenticate, sendMoneyValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return sendMoney(req, res);
});

// Request money from another user
router.post('/request', authenticate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return requestMoney(req, res);
});

// Respond to incoming request (ACCEPT or REJECT)
router.post('/respond/:id', authenticate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return respondRequest(req, res);
});

// Transaction history
router.get('/history', authenticate, txHistoryValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return getHistory(req, res);
});

// Check balance across accounts
router.get('/balance', authenticate, checkBalance);

// Check transaction status
router.get('/status/:id', authenticate, txStatus);

export default router;
