import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isLoggedIn, user, logout, isFreelancer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const handleBrowse = () => {
    if (location.pathname === '/') {
      // Already on home — just scroll to gigs
      document.getElementById('gigs-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      // Navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        document.getElementById('gigs-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 300);
    }
  };

  // Active link style helper
  const linkClass = (path) =>
    `text-sm transition-colors ${
      location.pathname === path
        ? 'text-blue-600 font-medium'
        : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 tracking-tight flex-shrink-0"
        >
          Dev<span className="text-blue-600">Hire</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={handleBrowse}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Browse gigs
          </button>

          {isLoggedIn && (
            <Link to="/orders" className={linkClass('/orders')}>
              My orders
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isFreelancer && (
                <Link
                  to="/gigs/create"
                  className="hidden md:block text-sm bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  + Post a gig
                </Link>
              )}

              {/* Avatar with name tooltip */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm text-gray-700 font-medium">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;