import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // links to User model
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title too long'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description too long'],
  },
  category: {
    type: String,
    required: true,
    enum: [
      'web-development',
      'mobile-apps',
      'ui-ux-design',
      'backend',
      'devops',
      'blockchain',
      'ai-ml',
      'other',
    ],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [100, 'Minimum price is ₹100'],
  },
  deliveryDays: {
    type: Number,
    required: true,
    min: [1, 'Minimum 1 day delivery'],
  },
  revisions: {
    type: Number,
    default: 1,
  },
  features: [String],    // e.g. ["Responsive design", "SEO optimised"]
  images: [String],      // Cloudinary URLs
  coverImage: {
    type: String,
    default: '',
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  starNumber: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// TEXT INDEX — this is what makes search work
// MongoDB will search across title + description when you use $text
gigSchema.index({ title: 'text', description: 'text' });

// COMPOUND INDEX — speeds up category + price filter queries
// Without this, filtering 10,000 gigs by category does a full scan
gigSchema.index({ category: 1, price: 1 });

// INDEX on userId — fast lookup of "all gigs by this freelancer"
gigSchema.index({ userId: 1 });

export default mongoose.model('Gig', gigSchema);