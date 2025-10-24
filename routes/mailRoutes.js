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

router.get('/recipients', clerkAuth, getRecipients);

router.post('/recipients', clerkAuth, addRecipient);

router.put('/recipients/:id', clerkAuth, updateRecipient);

router.delete('/recipients/:id', clerkAuth, deleteRecipient);

router.get('/status', getEmailStatus);

export default router;
