import * as gigService from '../services/gig.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createGig = async (req, res, next) => {
  try {
    // req.user.id comes from verifyToken middleware
    // req.files comes from multer upload middleware
    const gig = await gigService.createGig(req.user.id, req.body, req.files);
    res.status(201).json(new ApiResponse(201, gig, 'Gig created successfully'));
  } catch (err) {
    next(err);
  }
};

export const getAllGigs = async (req, res, next) => {
  try {
    // req.query = everything after ? in the URL
    // e.g. /api/gigs?search=react&category=web-development&minPrice=500
    const result = await gigService.getAllGigs(req.query);
    res.status(200).json(new ApiResponse(200, result, 'Gigs fetched'));
  } catch (err) {
    next(err);
  }
};

export const getSingleGig = async (req, res, next) => {
  try {
    const gig = await gigService.getSingleGig(req.params.id);
    res.status(200).json(new ApiResponse(200, gig, 'Gig fetched'));
  } catch (err) {
    next(err);
  }
};

export const updateGig = async (req, res, next) => {
  try {
    const gig = await gigService.updateGig(req.params.id, req.user.id, req.body);
    res.status(200).json(new ApiResponse(200, gig, 'Gig updated'));
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const result = await gigService.deleteGig(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, result, 'Gig deleted'));
  } catch (err) {
    next(err);
  }
};