import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// ── CATEGORY DATA ──────────────────────────────────────────
const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'web-development', label: 'Web Dev' },
  { id: 'mobile-apps', label: 'Mobile Apps' },
  { id: 'ui-ux-design', label: 'UI / UX' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'blockchain', label: 'Blockchain' },
];

// ── GIG CARD ───────────────────────────────────────────────
// Separate component so Home stays clean
const GigCard = ({ gig }) => {
  const navigate = useNavigate();
  const avgRating = gig.starNumber > 0
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : null;

  return (
    <div
      onClick={() => navigate(`/gigs/${gig._id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="aspect-video bg-blue-50 overflow-hidden">
        {gig.coverImage ? (
          <img
            src={gig.coverImage}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wide">
              {gig.category?.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Freelancer info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {gig.userId?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 truncate">
            {gig.userId?.name}
          </span>
          {gig.userId?.country && (
            <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
              {gig.userId.country}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-3">
          {gig.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {avgRating ? (
              <>
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-medium text-gray-700">{avgRating}</span>
                <span className="text-xs text-gray-400">({gig.starNumber})</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">New</span>
            )}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            ₹{gig.price.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SKELETON LOADER ────────────────────────────────────────
// Shows while gigs are loading — looks like cards
const GigSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-100"/>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100"/>
        <div className="h-3 bg-gray-100 rounded w-24"/>
      </div>
      <div className="h-3 bg-gray-100 rounded w-full"/>
      <div className="h-3 bg-gray-100 rounded w-3/4"/>
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <div className="h-3 bg-gray-100 rounded w-12"/>
        <div className="h-3 bg-gray-100 rounded w-16"/>
      </div>
    </div>
  </div>
);

// ── HOME PAGE ──────────────────────────────────────────────
const Home = () => {
  const { isLoggedIn, isFreelancer } = useAuth();
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [total, setTotal] = useState(0);

  // Fetch gigs whenever search, category, or sort changes
  useEffect(() => {
    fetchGigs();
  }, [search, category, sort]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = { sort, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;

      const { data } = await api.get('/gigs', { params });
      setGigs(data.data.gigs);
      setTotal(data.data.total);
    } catch (err) {
      console.error('Failed to fetch gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);  // triggers useEffect above
  };

  const handleCategoryClick = (catId) => {
    setCategory(catId);
    setSearch('');          // clear search when switching category
    setSearchInput('');
  };

  return (


    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <section className="border-b border-gray-100 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>
            India's tech freelance platform
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Hire tech talent
            <span className="text-blue-600"> that delivers.</span>
          </h1>

          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Browse verified freelancers for web, mobile, and software projects.
            Starting from ₹500.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex border border-gray-200 rounded-lg overflow-hidden max-w-xl mx-auto shadow-sm"
          >
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search React developer, Flutter app, Node.js API..."
              className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Popular searches */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-gray-400">Popular:</span>
            {['React', 'Flutter', 'Node.js', 'UI Design', 'MongoDB'].map(term => (
              <button
                key={term}
                onClick={() => { setSearchInput(term); setSearch(term); }}
                className="text-xs text-gray-600 hover:text-blue-600 hover:underline transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section id="gigs-section" className="max-w-6xl mx-auto px-6 py-10">

        {/* Category + Sort row */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 outline-none cursor-pointer bg-white"
          >
            <option value="createdAt">Latest</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {/* Results count + active search */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            {loading ? 'Loading...' : (
              <>
                <span className="font-medium text-gray-900">{total}</span>
                {' '}gig{total !== 1 ? 's' : ''} found
                {search && (
                  <span> for "<span className="text-blue-600">{search}</span>"</span>
                )}
                {category && (
                  <span> in <span className="text-blue-600">
                    {CATEGORIES.find(c => c.id === category)?.label}
                  </span></span>
                )}
              </>
            )}
          </div>

          {/* Clear filters */}
          {(search || category) && (
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setCategory(''); }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Gig grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <GigSkeleton key={i}/>)}
          </div>
        ) : gigs.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs found</h3>
            <p className="text-sm text-gray-500 mb-6">
              Try a different search or category
            </p>
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setCategory(''); }}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Browse all gigs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {gigs.map(gig => <GigCard key={gig._id} gig={gig}/>)}
          </div>
        )}

        {/* CTA for freelancers */}
        {isLoggedIn && isFreelancer && (
          <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Ready to earn?
              </h3>
              <p className="text-sm text-gray-500">
                Post your first gig and start getting clients today.
              </p>
            </div>
            <button
              onClick={() => navigate('/gigs/create')}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              Post a gig
            </button>
          </div>
        )}

        {/* CTA for visitors */}
        {!isLoggedIn && (
          <div className="mt-12 bg-gray-900 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to get started?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Join hundreds of clients and freelancers on Dev
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get started free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white/10 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        )}

      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 mt-16 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="text-lg font-bold text-gray-900">
            Dev<span className="text-blue-600">Hire</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer">About</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms</span>
            <span className="hover:text-gray-600 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-600 cursor-pointer">Support</span>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 Dev. Made in India.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;