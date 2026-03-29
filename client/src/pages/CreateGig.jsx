import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'web-development', label: 'Web Development' },
  { id: 'mobile-apps', label: 'Mobile Apps' },
  { id: 'ui-ux-design', label: 'UI / UX Design' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'other', label: 'Other' },
];

const CreateGig = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'web-development',
    price: '',
    deliveryDays: '',
    revisions: '1',
    features: [],
    images: [],
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add feature tag on Enter or comma
  const handleFeatureKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = featureInput.trim();
      if (val && !form.features.includes(val) && form.features.length < 8) {
        setForm(prev => ({ ...prev, features: [...prev.features, val] }));
        setFeatureInput('');
      }
    }
  };

  const removeFeature = (f) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter(x => x !== f),
    }));
  };

  // Image preview before upload
  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setForm(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price || !form.deliveryDays) {
      return toast.error('Please fill all required fields');
    }
    if (Number(form.price) < 100) {
      return toast.error('Minimum price is ₹100');
    }

    setLoading(true);
    try {
      // Must use FormData — sending files + text together
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('deliveryDays', form.deliveryDays);
      formData.append('revisions', form.revisions);
      formData.append('features', JSON.stringify(form.features));
      form.images.forEach(img => formData.append('images', img));

      await api.post('/gigs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Gig created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create a new gig
          </h1>
          <p className="text-sm text-gray-500">
            Tell clients what you offer and start earning
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Gig title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="I will build your React website with Tailwind CSS"
              maxLength={100}
              className={inputClass}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {form.title.length}/100
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe exactly what you'll deliver, your process, and why clients should hire you..."
              rows={6}
              maxLength={2000}
              className={`${inputClass} resize-none`}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {form.description.length}/2000
            </div>
          </div>

          {/* Price + Delivery + Revisions */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="4999"
                min={100}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Delivery days <span className="text-red-400">*</span>
              </label>
              <input
                name="deliveryDays"
                type="number"
                value={form.deliveryDays}
                onChange={handleChange}
                placeholder="7"
                min={1}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Revisions
              </label>
              <input
                name="revisions"
                type="number"
                value={form.revisions}
                onChange={handleChange}
                placeholder="3"
                min={0}
                className={inputClass}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What's included
              <span className="text-xs font-normal text-gray-400 ml-2">
                Press Enter to add (max 8)
              </span>
            </label>
            <div className="border border-gray-200 rounded-md p-3 focus-within:border-blue-500 transition-colors">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.features.map(f => (
                  <span
                    key={f}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full"
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() => removeFeature(f)}
                      className="text-blue-400 hover:text-blue-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleFeatureKeyDown}
                placeholder="e.g. Responsive design, SEO optimised, Dark mode..."
                className="w-full outline-none text-sm text-gray-900 placeholder-gray-400"
                disabled={form.features.length >= 8}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Gig images
              <span className="text-xs font-normal text-gray-400 ml-2">
                Up to 5 images
              </span>
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
              <div className="text-3xl mb-2">📁</div>
              <span className="text-sm font-medium text-gray-700">
                Click to upload images
              </span>
              <span className="text-xs text-gray-400 mt-1">
                JPG, PNG, WEBP up to 5MB each
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Image preview */}
            {form.images.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {form.images.map((file, i) => (
                  <div
                    key={i}
                    className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200 relative"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Publishing...' : 'Publish gig'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateGig;