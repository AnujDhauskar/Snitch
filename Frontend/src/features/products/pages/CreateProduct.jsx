import  { useState } from 'react';
import { useProduct } from '../hook/useproduct';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceamount: "",
    pricecurrency: "USD",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 7 * 1024 * 1024) {
        setError("Image size should be less than 7MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      if (error) setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.priceamount || !formData.image) {
      setError("Please fill all required fields, including an image.");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("priceAmount", formData.priceamount);
      submitData.append("priceCurrency", formData.pricecurrency);
      submitData.append("images", formData.image);

      await handleCreateProduct(submitData);
      navigate("/"); 
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4] flex items-center justify-center p-4 py-12 font-sans select-none antialiased selection:bg-[#8B5CF6]/30 selection:text-white">
      {/* Glow effect */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-[700px] bg-[#121214] border border-white/10 rounded-[24px] overflow-hidden relative z-10 shadow-2xl shadow-purple-950/10 p-8 sm:p-12">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[32px] font-bold text-white tracking-tight mb-2 font-display">
            Create Product
          </h2>
          <p className="text-sm text-[#958EA0]">
            Configure your new listing details below to start selling.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-[#FFB4AB]/10 border border-[#FFB4AB]/20 text-[#FFB4AB] rounded-xl text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
              Product Image
            </label>
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className={`w-full border-2 border-dashed transition-all duration-300 rounded-xl flex flex-col items-center justify-center p-8 
                ${imagePreview ? 'border-white/10 bg-[#121214]' : 'border-white/10 bg-[#121214] hover:bg-white/5 hover:border-[#8B5CF6]/50'}
              `}>
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#1C1C1F] border border-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                      <svg className="w-6 h-6 text-[#DDD6FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white mb-1">Upload Product Image</span>
                    <span className="text-xs text-[#494454]">Max size 7MB. PNG, JPG, or WEBP.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Neon Horizon Synthesizer"
              className="w-full bg-[#121214] border border-white/10 focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#494454] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the features and condition..."
              rows="4"
              className="w-full bg-[#121214] border border-white/10 focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#494454] transition-all resize-y"
            ></textarea>
          </div>

          {/* Price Section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                Amount
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494454]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="number"
                  name="priceamount"
                  value={formData.priceamount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full bg-[#121214] border border-white/10 focus:border-[#8B5CF6] outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-[#494454] transition-all"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5 ml-1">
                Currency
              </label>
              <div className="relative">
                <select
                  name="pricecurrency"
                  value={formData.pricecurrency}
                  onChange={handleChange}
                  className="w-full bg-[#121214] border border-white/10 focus:border-[#8B5CF6] outline-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#494454] transition-all appearance-none cursor-pointer"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#958EA0] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-[24px] shadow-lg shadow-purple-950/20 active:scale-[0.98] transition-all text-sm relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Listing Product...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  List Product
                </div>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateProduct;
