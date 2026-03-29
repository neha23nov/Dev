import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
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
  title: {
    type: String,
    required: true,   // snapshot of gig title at time of order
  },
  price: {
    type: Number,
    required: true,   // snapshot of price — even if freelancer changes gig later
  },
  coverImage: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  deliveryDays: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,   // becomes true after mock/real payment
  },
  requirements: {
    type: String,
    default: '',      // client fills in what they need built
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  paymentIntent: {
    type: String,
    default: '',      // store payment ID here when real gateway added later
  },
}, { timestamps: true });

// Fast lookup: all orders for a client
orderSchema.index({ clientId: 1, status: 1 });

// Fast lookup: all orders for a freelancer
orderSchema.index({ freelancerId: 1, status: 1 });

// Fast lookup: all orders for a gig
orderSchema.index({ gigId: 1 });

export default mongoose.model('Order', orderSchema);