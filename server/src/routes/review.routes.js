import express from 'express';
import {
  createReview, getGigReviews, deleteReview
} from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyRole } from '../middleware/verifyRole.js';

const router = express.Router();

// Public — anyone can read reviews
router.get('/gig/:gigId', getGigReviews);

// Protected — only clients can post reviews
router.post('/', verifyToken, verifyRole('client'), createReview);
router.delete('/:id', verifyToken, verifyRole('client'), deleteReview);

export default router;