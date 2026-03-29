import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: result,
    });
  } catch (err) {
    console.log('REGISTER ERROR:', err.message);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err) {
    console.log('LOGIN ERROR:', err.message);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};