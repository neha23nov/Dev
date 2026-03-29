import Gig from '../models/Gig.js';
import ApiError from '../utils/ApiError.js';

// CREATE GIG
export const createGig = async (userId, body, files) => {
  const { title, description, category, price, deliveryDays, revisions, features } = body;

  // Build images array from Cloudinary upload results
  const images = files?.map(file => file.path) || [];
  const coverImage = images[0] || '';

  const gig = await Gig.create({
    userId,
    title,
    description,
    category,
    price: Number(price),
    deliveryDays: Number(deliveryDays),
    revisions: Number(revisions) || 1,
    features: features ? JSON.parse(features) : [],
    images,
    coverImage,
  });

  return gig;
};

// GET ALL GIGS — with search, filter, sort, pagination
export const getAllGigs = async (query) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = 'createdAt',
    page = 1,
    limit = 12,
    cursor,         // for cursor-based pagination
  } = query;

  const filter = {};

  // Text search using MongoDB $text index
  // Only works because we added gigSchema.index({ title: 'text', description: 'text' })
  if (search) {
    filter.$text = { $search: search };
  }

  if (category) filter.category = category;

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Cursor-based pagination — faster than skip() at scale
  // skip(1000) makes MongoDB scan 1000 docs to skip them — slow
  // cursor uses an index to jump directly — always fast
  if (cursor) {
    filter._id = { $gt: cursor };
  }

  const sortOptions = {
    createdAt: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { totalStars: -1 },
  };

  const gigs = await Gig.find(filter)
    .sort(sortOptions[sort] || { createdAt: -1 })
    .limit(Number(limit))
    .populate('userId', 'name avatar country');
    // populate replaces userId ObjectId with actual user data

  const total = await Gig.countDocuments(filter);

  // Send back the last id as next cursor
  const nextCursor = gigs.length === Number(limit)
    ? gigs[gigs.length - 1]._id
    : null;

  return { gigs, total, nextCursor };
};

// GET SINGLE GIG
export const getSingleGig = async (gigId) => {
  const gig = await Gig.findById(gigId)
    .populate('userId', 'name avatar bio country skills');

  if (!gig) throw new ApiError(404, 'Gig not found');
  return gig;
};

// UPDATE GIG
export const updateGig = async (gigId, userId, body) => {
  const gig = await Gig.findById(gigId);
  if (!gig) throw new ApiError(404, 'Gig not found');

  // Only the owner can update their own gig
  if (gig.userId.toString() !== userId) {
    throw new ApiError(403, 'You can only update your own gigs');
  }

  const updated = await Gig.findByIdAndUpdate(
    gigId,
    { $set: body },
    { new: true, runValidators: true }
    // new:true returns updated doc, runValidators re-checks schema rules
  );

  return updated;
};

// DELETE GIG
export const deleteGig = async (gigId, userId) => {
  const gig = await Gig.findById(gigId);
  if (!gig) throw new ApiError(404, 'Gig not found');

  if (gig.userId.toString() !== userId) {
    throw new ApiError(403, 'You can only delete your own gigs');
  }

  await Gig.findByIdAndDelete(gigId);
  return { message: 'Gig deleted successfully' };
};