import express from 'express';
import {
  createGig, getAllGigs, getSingleGig, updateGig, deleteGig
} from '../controllers/gig.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyRole } from '../middleware/verifyRole.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// PUBLIC — anyone can browse gigs (no token needed)
router.get('/', getAllGigs);
router.get('/:id', getSingleGig);

// PROTECTED — only freelancers can create, update, delete
router.post(
  '/',
  verifyToken,
  verifyRole('freelancer'),
  upload.array('images', 5),    // max 5 images, field name = "images"
  createGig
);

router.put('/:id', verifyToken, verifyRole('freelancer'), updateGig);
router.delete('/:id', verifyToken, verifyRole('freelancer'), deleteGig);

export default router;
