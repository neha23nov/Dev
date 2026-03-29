import express from 'express';
import {
  sendMessage, getConversation, getUnreadCount
} from '../controllers/message.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// All message routes require login
router.use(verifyToken);

router.post('/', sendMessage);
router.get('/unread', getUnreadCount);
router.get('/:orderId', getConversation);

export default router;