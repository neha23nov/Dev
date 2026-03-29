import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  star: {
    type: Number,
    required: true,
    min: [1, 'Minimum 1 star'],
    max: [5, 'Maximum 5 stars'],
  },
  description: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: [500, 'Review too long'],
  },
}, { timestamps: true });

// One review per order — prevents a client reviewing same order twice
reviewSchema.index({ orderId: 1 }, { unique: true });

// Fast fetch of all reviews for a gig
reviewSchema.index({ gigId: 1 });

export default mongoose.model('Review', reviewSchema);