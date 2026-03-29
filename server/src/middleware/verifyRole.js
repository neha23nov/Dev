import ApiError from '../utils/ApiError.js';

// Usage: router.post('/gigs', verifyToken, verifyRole('freelancer'), createGig)
export const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Only ${roles.join('/')} can access this route.`)
      );
    }
    next();
  };
};