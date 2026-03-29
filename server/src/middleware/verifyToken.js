import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const verifyToken = (req, res, next) => {
  // Token comes in header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access denied. No token provided.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, role } now available in every route
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
};