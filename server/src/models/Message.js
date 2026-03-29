import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,    // every message belongs to an order's chat room
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Message cannot be empty'],
    maxlength: [2000, 'Message too long'],
  },
  isRead: {
    type: Boolean,
    default: false,    // for unread badge on frontend
  },
}, { timestamps: true });

// Fast fetch of all messages in a conversation
messageSchema.index({ orderId: 1, createdAt: 1 });

// Fast count of unread messages per user
messageSchema.index({ receiverId: 1, isRead: 1 });

export default mongoose.model('Message', messageSchema);