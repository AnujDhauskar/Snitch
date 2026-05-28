import { useState } from 'react';
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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-[#8B5CF6]/40 selection:text-white">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1729525589463-818e3a5bd766?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-sm"></div>
      </div>

      {/* Main card */}
      <div className="w-[95%] max-w-6xl bg-gradient-to-br from-[#121214]/95 via-[#1c1528]/85 to-[#3b217a]/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden relative z-10 shadow-[0_0_50px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(139,92,246,0.3)] p-8 sm:p-10 lg:p-14">

        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-200 tracking-tight mb-2">
            Create Product
          </h2>
          <p className="text-base sm:text-lg text-[#958EA0]">
            Configure your new listing details below to start selling.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-base flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Side: Image Upload */}
          <div className="group w-full md:w-2/5 flex flex-col">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#958EA0] mb-3 ml-1 transition-colors group-hover:text-purple-400">
              Product Image
            </label>
            <div className="relative cursor-pointer flex-1 min-h-[250px] lg:min-h-[350px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className={`absolute inset-0 w-full h-full border-2 border-dashed transition-all duration-300 rounded-3xl flex flex-col items-center justify-center p-8 
                ${imagePreview ? 'border-white/10 bg-black/20' : 'border-white/10 bg-black/20 group-hover:bg-white/5 group-hover:border-[#8B5CF6]/50'}
              `}>
                {imagePreview ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden group-hover:ring-2 ring-[#8B5CF6]/50 transition-all">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-base font-semibold bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20">Change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#8B5CF6]/20 transition-all duration-300 shadow-xl">
                      <svg className="w-8 h-8 text-[#DDD6FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold text-white mb-2 text-center">Upload Image</span>
                    <span className="text-sm text-[#958EA0] text-center">Max 7MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Inputs */}
          <div className="flex-1 flex flex-col gap-6 justify-center">
            {/* Title */}
            <div className="group">
              <label className="block text-sm font-bold uppercase tracking-widest text-[#958EA0] mb-2 ml-1 transition-colors group-hover:text-purple-400">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Neon Horizon Synthesizer"
                className="w-full bg-black/20 border border-white/10 focus:border-[#8B5CF6] focus:bg-white/5 focus:ring-1 focus:ring-[#8B5CF6] outline-none rounded-2xl px-6 py-4 text-base text-white placeholder-[#494454] transition-all"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-bold uppercase tracking-widest text-[#958EA0] mb-2 ml-1 transition-colors group-hover:text-purple-400">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the features..."
                rows="3"
                className="w-full bg-black/20 border border-white/10 focus:border-[#8B5CF6] focus:bg-white/5 focus:ring-1 focus:ring-[#8B5CF6] outline-none rounded-2xl px-6 py-4 text-base text-white placeholder-[#494454] transition-all resize-none"
              ></textarea>
            </div>

            {/* Price Section */}
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 group">
                <label className="block text-sm font-bold uppercase tracking-widest text-[#958EA0] mb-2 ml-1 transition-colors group-hover:text-purple-400">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#958EA0] group-focus-within:text-[#8B5CF6] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="w-full bg-black/20 border border-white/10 focus:border-[#8B5CF6] focus:bg-white/5 focus:ring-1 focus:ring-[#8B5CF6] outline-none rounded-2xl pl-14 pr-6 py-4 text-base text-white placeholder-[#494454] transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 group">
                <label className="block text-sm font-bold uppercase tracking-widest text-[#958EA0] mb-2 ml-1 transition-colors group-hover:text-purple-400">
                  Currency
                </label>
                <div className="relative">
                  <select
                    name="pricecurrency"
                    value={formData.pricecurrency}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 focus:border-[#8B5CF6] focus:bg-white/5 focus:ring-1 focus:ring-[#8B5CF6] outline-none rounded-2xl px-6 py-4 text-base text-white placeholder-[#494454] transition-all appearance-none cursor-pointer"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="JPY">JPY</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#958EA0] pointer-events-none group-focus-within:text-[#8B5CF6] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-300 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                {loading ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Listing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    List Product
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
