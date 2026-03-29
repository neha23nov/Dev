import * as reviewService from '../services/review.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(new ApiResponse(201, review, 'Review posted'));
  } catch (err) {
    next(err);
  }
};

export const getGigReviews = async (req, res, next) => {
  try {
    const data = await reviewService.getGigReviews(req.params.gigId);
    res.status(200).json(new ApiResponse(200, data, 'Reviews fetched'));
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, result, 'Review deleted'));
  } catch (err) {
    next(err);
  }
};