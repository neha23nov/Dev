import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },           // payload baked into token
    process.env.JWT_SECRET,          // secret key to sign it
    { expiresIn: process.env.JWT_EXPIRES_IN }  // expires in 7 days
  );
};

export default generateToken;