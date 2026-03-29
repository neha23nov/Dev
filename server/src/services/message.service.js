import Message from '../models/Message.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

// SEND MESSAGE — saved to DB, Socket.io handles real-time broadcast
export const sendMessage = async (senderId, body) => {
  const { orderId, receiverId, text } = body;

  // Verify sender is part of this order
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const isInvolved =
    order.clientId.toString() === senderId.toString() ||
    order.freelancerId.toString() === senderId.toString();

  if (!isInvolved) {
    throw new ApiError(403, 'You are not part of this order');
  }

  const message = await Message.create({
    orderId,
    senderId,
    receiverId,
    text,
  });

  // Populate sender info for real-time broadcast
  const populated = await message.populate('senderId', 'name avatar');
  return populated;
};

// GET CONVERSATION — all messages for an order
export const getConversation = async (orderId, userId) => {
  // Verify user is part of this order
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const isInvolved =
    order.clientId.toString() === userId.toString() ||
    order.freelancerId.toString() === userId.toString();

  if (!isInvolved) throw new ApiError(403, 'Access denied');

  // Mark all messages sent to this user as read
  await Message.updateMany(
    { orderId, receiverId: userId, isRead: false },
    { $set: { isRead: true } }
  );

  const messages = await Message.find({ orderId })
    .populate('senderId', 'name avatar')
    .sort({ createdAt: 1 });   // oldest first — chat order

  return messages;
};

// GET UNREAD COUNT — for notification badge
export const getUnreadCount = async (userId) => {
  const count = await Message.countDocuments({
    receiverId: userId,
    isRead: false,
  });
  return { unreadCount: count };
};