import Order from '../models/Order.js';
import Gig from '../models/Gig.js';
import ApiError from '../utils/ApiError.js';

// PLACE ORDER — client places order on a gig
export const placeOrder = async (clientId, gigId, requirements) => {
  // Fetch the gig to snapshot its details
  const gig = await Gig.findById(gigId);
  if (!gig) throw new ApiError(404, 'Gig not found');

  // A freelancer cannot order their own gig
  if (gig.userId.toString() === clientId.toString()) {
    throw new ApiError(400, 'You cannot order your own gig');
  }

  const order = await Order.create({
    gigId,
    clientId,
    freelancerId: gig.userId,   // pulled from gig
    title: gig.title,           // snapshot
    price: gig.price,           // snapshot
    coverImage: gig.coverImage,
    deliveryDays: gig.deliveryDays,
    requirements: requirements || '',
    // Mock payment: mark as paid and active immediately
    isPaid: true,
    status: 'active',
  });

  // Increment gig's totalOrders count
  await Gig.findByIdAndUpdate(gigId, { $inc: { totalOrders: 1 } });

  return order;
};

// GET ORDERS — role-based fetch
// Client sees orders they placed
// Freelancer sees orders they received
export const getOrders = async (userId, role, status) => {
  const filter = role === 'client'
    ? { clientId: userId }
    : { freelancerId: userId };

  // Optionally filter by status
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .populate('gigId', 'title coverImage')
    .populate('clientId', 'name avatar')
    .populate('freelancerId', 'name avatar')
    .sort({ createdAt: -1 });

  return orders;
};

// GET SINGLE ORDER
export const getSingleOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate('gigId')
    .populate('clientId', 'name avatar email')
    .populate('freelancerId', 'name avatar email');

  if (!order) throw new ApiError(404, 'Order not found');

  // Only client or freelancer of this order can view it
  const isInvolved =
    order.clientId._id.toString() === userId.toString() ||
    order.freelancerId._id.toString() === userId.toString();

  if (!isInvolved) throw new ApiError(403, 'Access denied');

  return order;
};

// UPDATE STATUS — only freelancer can update status
export const updateOrderStatus = async (orderId, freelancerId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  // Only the freelancer of this order can update it
  if (order.freelancerId.toString() !== freelancerId.toString()) {
    throw new ApiError(403, 'Only the assigned freelancer can update this order');
  }

  // Prevent going backwards in status
  const statusFlow = ['pending', 'active', 'completed', 'cancelled'];
  const currentIndex = statusFlow.indexOf(order.status);
  const newIndex = statusFlow.indexOf(status);

  if (newIndex < currentIndex && status !== 'cancelled') {
    throw new ApiError(400, 'Cannot revert order status');
  }

  const updates = { status };
  if (status === 'completed') updates.deliveredAt = new Date();

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { $set: updates },
    { new: true }
  );

  return updated;
};

// CANCEL ORDER — client can cancel only if still pending/active
export const cancelOrder = async (orderId, clientId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.clientId.toString() !== clientId.toString()) {
    throw new ApiError(403, 'Only the client can cancel this order');
  }

  if (order.status === 'completed') {
    throw new ApiError(400, 'Cannot cancel a completed order');
  }

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status: 'cancelled' } },
    { new: true }
  );

  // Decrement gig totalOrders
  await Gig.findByIdAndUpdate(order.gigId, { $inc: { totalOrders: -1 } });

  return updated;
};

// DASHBOARD STATS — for freelancer earnings overview
export const getFreelancerStats = async (freelancerId) => {
  const orders = await Order.find({ freelancerId, isPaid: true });

  const totalEarnings = orders.reduce((sum, o) => sum + o.price, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const activeOrders = orders.filter(o => o.status === 'active').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  return {
    totalEarnings,
    completedOrders,
    activeOrders,
    cancelledOrders,
    totalOrders: orders.length,
  };
};