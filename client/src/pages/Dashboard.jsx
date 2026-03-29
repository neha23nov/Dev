import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isFreelancer } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes] = await Promise.all([
        api.get('/orders'),
      ]);
      setOrders(ordersRes.data.data);

      if (isFreelancer) {
        const statsRes = await api.get('/orders/stats');
        setStats(statsRes.data.data);
        // Fetch freelancer's own gigs
        // Filter from all gigs where userId matches
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Client stats derived from orders
  const clientStats = {
    totalSpent: orders.reduce((s, o) => o.isPaid ? s + o.price : s, 0),
    activeOrders: orders.filter(o => o.status === 'active').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
  };

  const displayStats = isFreelancer ? stats : clientStats;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user?.name}
              </h1>
              <span className="text-xs text-gray-400 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {isFreelancer ? (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">
                    ₹{(displayStats?.totalEarnings || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-500">Total earnings</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-0.5">
                    {displayStats?.activeOrders || 0}
                  </div>
                  <div className="text-xs text-gray-500">Active orders</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600 mb-0.5">
                    {displayStats?.completedOrders || 0}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">
                    {displayStats?.totalOrders || 0}
                  </div>
                  <div className="text-xs text-gray-500">Total orders</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">
                    ₹{clientStats.totalSpent.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-500">Total spent</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-0.5">
                    {clientStats.activeOrders}
                  </div>
                  <div className="text-xs text-gray-500">Active orders</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600 mb-0.5">
                    {clientStats.completedOrders}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">
                    {orders.length}
                  </div>
                  <div className="text-xs text-gray-500">Total orders</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View all orders
          </button>
          {isFreelancer && (
            <button
              onClick={() => navigate('/gigs/create')}
              className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              + Post new gig
            </button>
          )}
          {!isFreelancer && (
            <button
              onClick={() => navigate('/')}
              className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Browse gigs
            </button>
          )}
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent orders
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"/>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-xl">
              No orders yet
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div
                  key={order._id}
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:border-gray-200 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-8 bg-blue-50 rounded-md flex-shrink-0 overflow-hidden">
                    {order.coverImage
                      ? <img src={order.coverImage} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-xs text-blue-300">Gig</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {order.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    { pending: 'bg-yellow-50 text-yellow-700', active: 'bg-blue-50 text-blue-700', completed: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700' }[order.status]
                  }`}>
                    {order.status}
                  </span>
                  <div className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    ₹{order.price?.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;