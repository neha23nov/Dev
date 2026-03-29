import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.email || !form.password) {
    return toast.error('Please fill all fields');
  }

  setLoading(true);
  try {
    const { data } = await api.post('/auth/login', form);
    
    // This will show the exact shape in console
    console.log('Full response:', data);

    // Your ApiResponse shape is: { statusCode, data: { token, user }, message }
    const token = data?.data?.token;
    const userData = data?.data?.user;

    console.log('Token:', token);
    console.log('User:', userData);

    if (!token || !userData) {
      toast.error('Login failed — unexpected response');
      return;
    }

    login(userData, token);
    toast.success(`Welcome back, ${userData.name?.split(' ')[0]}!`);
    navigate(userData.role === 'freelancer' ? '/dashboard' : '/');

  } catch (err) {
    console.log('Error response:', err.response?.data);
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
   <div className="h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            Dev<span className="text-blue-600">Hire</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="text-xs text-gray-400">or continue as</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        {/* Quick test login buttons — remove before production */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ email: 'client@test.com', password: 'test1234' })}
            className="border border-gray-200 text-gray-600 py-2 rounded-md text-xs font-medium hover:bg-gray-50"
          >
            Test as client
          </button>
          <button
            type="button"
            onClick={() => setForm({ email: 'freelancer@test.com', password: 'test1234' })}
            className="border border-gray-200 text-gray-600 py-2 rounded-md text-xs font-medium hover:bg-gray-50"
          >
            Test as freelancer
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;