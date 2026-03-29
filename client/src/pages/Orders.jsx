import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700',
  active:    'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const Orders = () => {
  const { isFreelancer, isClient } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/orders', { params });
      setOrders(data.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (orderId) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'completed' });
      toast.success('Order marked as completed');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm('Cancel this order?')) return;
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isFreelancer ? 'Incoming orders' : 'My orders'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isFreelancer
                ? 'Orders clients have placed on your gigs'
                : 'Track your placed orders'}
            </p>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 outline-none bg-white"
          >
            <option value="">All orders</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-12 bg-gray-100 rounded-lg"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-2/3"/>
                    <div className="h-3 bg-gray-100 rounded w-1/3"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {isClient
                ? 'Browse gigs and place your first order'
                : 'Share your gigs to start getting orders'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Browse gigs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex gap-4 items-start">

                  {/* Cover */}
                  <div className="w-16 h-12 bg-blue-50 rounded-lg flex-shrink-0 overflow-hidden">
                    {order.coverImage ? (
                      <img
                        src={order.coverImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-blue-400 font-medium">
                        Gig
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                      {order.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>
                        {isFreelancer
                          ? `Client: ${order.clientId?.name}`
                          : `Freelancer: ${order.freelancerId?.name}`}
                      </span>
                      <span>·</span>
                      <span>{order.deliveryDays} day delivery</span>
                      <span>·</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {order.requirements && (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">
                        {order.requirements}
                      </p>
                    )}
                  </div>

                  {/* Right: status + price + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{order.price?.toLocaleString('en-IN')}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* Chat button */}
                      <button
                        onClick={() => navigate(`/chat/${order._id}`)}
                        className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        Chat
                      </button>

                      {/* Freelancer: mark complete */}
                      {isFreelancer && order.status === 'active' && (
                        <button
                          onClick={() => markComplete(order._id)}
                          disabled={updatingId === order._id}
                          className="text-xs text-green-700 border border-green-200 px-3 py-1 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                          {updatingId === order._id ? '...' : 'Mark done'}
                        </button>
                      )}

                      {/* Client: cancel */}
                      {isClient && ['pending', 'active'].includes(order.status) && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          disabled={updatingId === order._id}
                          className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {updatingId === order._id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;