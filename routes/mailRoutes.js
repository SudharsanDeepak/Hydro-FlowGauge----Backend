import express from 'express';
import { sendEmail, getEmailStatus } from '../controllers/mailController.js';
import clerkAuth from '../middleware/hybridAuthMiddleware.js';

const router = express.Router();

// @desc    Send an email
// @route   POST /api/mail/send
// @access  Private
router.post('/send', clerkAuth, sendEmail);

// @desc    Get email service status
// @route   GET /api/mail/status
// @access  Public
router.get('/status', getEmailStatus);

export default router;
