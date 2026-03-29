import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isClient, user } = useAuth();

  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetchGig();
    fetchReviews();
  }, [id]);

  const fetchGig = async () => {
    try {
      const { data } = await api.get(`/gigs/${id}`);
      setGig(data.data);
    } catch {
      toast.error('Gig not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/gig/${id}`);
      setReviews(data.data.reviews);
      setAvgRating(data.data.avgRating);
    } catch {}
  };

  const handleOrder = async () => {
    if (!isLoggedIn) return navigate('/register');
    if (!isClient) return toast.error('Only clients can place orders');
    if (!requirements.trim()) return toast.error('Please describe what you need');

    setOrdering(true);
    try {
      const { data } = await api.post('/orders', {
        gigId: id,
        requirements,
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4"/>
          <div className="aspect-video bg-gray-100 rounded-xl"/>
        </div>
        <div className="h-64 bg-gray-100 rounded-xl"/>
      </div>
    </div>
  );

  if (!gig) return null;

  const avgRatingNum = gig.starNumber > 0
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: Gig info ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <span>/</span>
              <span className="capitalize">
                {gig.category?.replace('-', ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {gig.title}
            </h1>

            {/* Freelancer info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {gig.userId?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {gig.userId?.name}
                </div>
                <div className="text-xs text-gray-400">
                  {gig.userId?.country || 'India'}
                </div>
              </div>
              {avgRatingNum && (
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-700">
                    {avgRatingNum}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({gig.starNumber} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Images */}
            {gig.images?.length > 0 && (
              <div className="space-y-3">
                <div className="aspect-video bg-blue-50 rounded-xl overflow-hidden">
                  <img
                    src={gig.images[activeImg]}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {gig.images.length > 1 && (
                  <div className="flex gap-2">
                    {gig.images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-12 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                          activeImg === i
                            ? 'border-blue-600'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this gig
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {gig.description}
              </p>
            </div>

            {/* Features */}
            {gig.features?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  What's included
                </h2>
                <div className="space-y-2">
                  {gig.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-blue-500 font-bold">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews
                {reviews.length > 0 && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({reviews.length})
                  </span>
                )}
              </h2>
              {reviews.length === 0 ? (
                <div className="text-sm text-gray-400 py-4">
                  No reviews yet — be the first to work with this freelancer.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div
                      key={review._id}
                      className="border border-gray-100 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {review.clientId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.clientId?.name}
                          </div>
                          <div className="flex">
                            {Array(review.star).fill(0).map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xs">★</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(review.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT: Order card ── */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-xl p-5 sticky top-24 space-y-4">

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Starting at</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{gig.price?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="h-px bg-gray-100"/>

              {/* Delivery details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery time</span>
                  <span className="font-medium text-gray-900">
                    {gig.deliveryDays} day{gig.deliveryDays > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Revisions</span>
                  <span className="font-medium text-gray-900">
                    {gig.revisions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Orders</span>
                  <span className="font-medium text-gray-900">
                    {gig.totalOrders}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100"/>

              {/* Requirements textarea */}
              {isClient && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Describe your requirements
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Tell the freelancer exactly what you need built..."
                    rows={4}
                    className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              )}

              {/* CTA button */}
              <button
                onClick={handleOrder}
                disabled={ordering}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {ordering
                  ? 'Placing order...'
                  : isLoggedIn
                  ? isClient
                    ? 'Place order'
                    : 'Only clients can order'
                  : 'Sign up to order'}
              </button>

              {/* Trust note */}
              <p className="text-xs text-gray-400 text-center">
                Payment held securely until delivery
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GigDetail;