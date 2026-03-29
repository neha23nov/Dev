import * as orderService from '../services/order.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const placeOrder = async (req, res, next) => {
  try {
    const { gigId, requirements } = req.body;
    const order = await orderService.placeOrder(req.user.id, gigId, requirements);
    res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(
      req.user.id,
      req.user.role,
      req.query.status    // optional filter ?status=active
    );
    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched'));
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await orderService.getSingleOrder(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, order, 'Order fetched'));
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );
    res.status(200).json(new ApiResponse(200, order, 'Status updated'));
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, order, 'Order cancelled'));
  } catch (err) {
    next(err);
  }
};

export const getFreelancerStats = async (req, res, next) => {
  try {
    const stats = await orderService.getFreelancerStats(req.user.id);
    res.status(200).json(new ApiResponse(200, stats, 'Stats fetched'));
  } catch (err) {
    next(err);
  }
};