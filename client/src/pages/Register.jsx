import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',   // default role
  });
  const [loading, setLoading] = useState(false);

  // Single handler for all inputs — no separate handler per field
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   // prevent page refresh on form submit

    if (!form.name || !form.email || !form.password) {
      return toast.error('Please fill all fields');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      // data.data = { token, user } from your ApiResponse
      login(data.data.user, data.data.token);
      toast.success('Welcome to Dev!');

      // Redirect based on role
      navigate(data.data.user.role === 'freelancer' ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role toggle — client or freelancer */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {['client', 'freelancer'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, role }))}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  form.role === role
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role === 'client' ? 'I want to hire' : 'I want to work'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
                className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up you agree to our Terms of Service and Privacy Policy
          </p>

        </div>
      </div>

      {/* Right — decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            India's tech freelance platform
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-8">
            Connect with verified developers, designers, and engineers across India.
            Get your project done — fast and affordable.
          </p>
          <div className="space-y-3">
            {[
              '✓ Verified tech freelancers',
              '✓ Secure payments in ₹',
              '✓ Real-time chat with your freelancer',
              '✓ Delivery guaranteed',
            ].map(item => (
              <div key={item} className="text-sm text-blue-100">{item}</div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;