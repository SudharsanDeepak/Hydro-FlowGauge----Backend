import express from 'express';
import { 
  getRecipients, 
  addRecipient, 
  updateRecipient, 
  deleteRecipient, 
  getEmailStatus 
} from '../controllers/mailController.js';
import clerkAuth from '../middleware/hybridAuthMiddleware.js';

const router = express.Router();

// @desc    Get all email recipients
// @route   GET /api/mail/recipients
// @access  Private
router.get('/recipients', clerkAuth, getRecipients);

// @desc    Add a new email recipient
// @route   POST /api/mail/recipients
// @access  Private
router.post('/recipients', clerkAuth, addRecipient);

// @desc    Update an email recipient
// @route   PUT /api/mail/recipients/:id
// @access  Private
router.put('/recipients/:id', clerkAuth, updateRecipient);

// @desc    Delete an email recipient
// @route   DELETE /api/mail/recipients/:id
// @access  Private
router.delete('/recipients/:id', clerkAuth, deleteRecipient);

// @desc    Get email service status
// @route   GET /api/mail/status
// @access  Public
router.get('/status', getEmailStatus);

export default router;
