import express from 'express';
import {
  placeOrder, getOrders, getSingleOrder,
  updateOrderStatus, cancelOrder, getFreelancerStats
} from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyRole } from '../middleware/verifyRole.js';

const router = express.Router();

// All order routes require login — no public order access
router.use(verifyToken);

// Both roles can view their own orders
router.get('/', getOrders);
router.get('/stats', verifyRole('freelancer'), getFreelancerStats);
router.get('/:id', getSingleOrder);

// Only clients can place or cancel orders
router.post('/', verifyRole('client'), placeOrder);
router.patch('/:id/cancel', verifyRole('client'), cancelOrder);

// Only freelancers can update order status
router.patch('/:id/status', verifyRole('freelancer'), updateOrderStatus);

export default router;


