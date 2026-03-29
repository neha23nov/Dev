export const errorHandler = (err, req, res, next) => {
  console.log('ERROR:', err.message);
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};