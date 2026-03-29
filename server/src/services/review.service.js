import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Gig from '../models/Gig.js';
import ApiError from '../utils/ApiError.js';

// CREATE REVIEW
export const createReview = async (clientId, body) => {
  const { gigId, orderId, star, description } = body;

  // Verify the order exists and belongs to this client
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.clientId.toString() !== clientId.toString()) {
    throw new ApiError(403, 'You can only review your own orders');
  }

  // Only completed orders can be reviewed
  if (order.status !== 'completed') {
    throw new ApiError(400, 'You can only review completed orders');
  }

  // Create review — will throw if orderId already exists (unique index)
  const review = await Review.create({
    gigId,
    orderId,
    clientId,
    freelancerId: order.freelancerId,
    star,
    description,
  });

  // Update gig rating — increment both totalStars and starNumber
  // Average = totalStars / starNumber — always instant, no aggregation
  await Gig.findByIdAndUpdate(gigId, {
    $inc: {
      totalStars: star,     // add this review's stars to running total
      starNumber: 1,        // increment review count
    },
  });

  return review;
};

// GET REVIEWS FOR A GIG
export const getGigReviews = async (gigId) => {
  const reviews = await Review.find({ gigId })
    .populate('clientId', 'name avatar country')
    .sort({ createdAt: -1 });

  // Calculate average on the fly for the response
  const total = reviews.length;
  const avgRating = total > 0
    ? reviews.reduce((sum, r) => sum + r.star, 0) / total
    : 0;

  return { reviews, avgRating: avgRating.toFixed(1), total };
};

// DELETE REVIEW — only the client who wrote it
export const deleteReview = async (reviewId, clientId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.clientId.toString() !== clientId.toString()) {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  // Reverse the gig rating update
  await Gig.findByIdAndUpdate(review.gigId, {
    $inc: {
      totalStars: -review.star,
      starNumber: -1,
    },
  });

  await Review.findByIdAndDelete(reviewId);
  return { message: 'Review deleted' };
};