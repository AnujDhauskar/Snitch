import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useproduct';
import { useParams, useNavigate } from 'react-router-dom';

const SellerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById, handleAddProductVarient, handleUpdateProduct } = useProduct();
  const [isSaving, setIsSaving] = useState(false);
  
  // States for new variant form
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
      images: [{ url: '' }],
      stock: 0,
      attributes: { color: '', size: '' },
      price: { amount: 0, currency: 'INR' }
  });

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      // Handle structure depending on API response
      setProduct(data?.product || data); 
    } catch(error) {
      console.error("Failed to fetch product details", error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddVariant = async() => {
      // FIX: First call the backend API to save the variant in the database
      try {
          const response = await handleAddProductVarient(productId, newVariant);
          
          if (response.success) {
              // FIX: Update local state with the returned product from backend
              setProduct(response.product);
              setShowVariantForm(false);
              setNewVariant({
                  images: [{ url: '', file: null }],
                  stock: 0,
                  attributes: { color: '', size: '' },
                  price: { amount: 0, currency: 'INR' }
              });
          }
      } catch (error) {
          console.error("Failed to add variant", error);
      }
  };

  // function to handle updating variant stock in local state
  const handleVariantStockChange = (idx, newStock) => {
      const updatedVarients = [...product.varients];
      updatedVarients[idx].stock = parseInt(newStock) || 0;
      setProduct({ ...product, varients: updatedVarients });
  };

  const handleSaveChanges = async () => {
      try {
          setIsSaving(true);
          const response = await handleUpdateProduct(productId, product);
          if (response.success) {
              setProduct(response.product);
          }
      } catch (error) {
          console.error("Failed to save changes", error);
      } finally {
          setIsSaving(false);
      }
  };

  if (!product) {
      return (
          <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  <p className="text-[#958EA0] text-sm">Loading product details...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans selection:bg-purple-500/30 pb-20">
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/5 bg-[#121214]/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-[#958EA0] hover:text-white border border-white/5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Product Details</h1>
                        <p className="text-xs text-[#958EA0]">Manage product information and variants</p>
                    </div>
                </div>
                <button 
                    onClick={handleSaveChanges} 
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </header>

        <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            {/* Left Column: Product Info */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#121214]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent"></div>
                    
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#1A1A1C] mb-6 relative group border border-white/5">
                        {product.images?.[0]?.url ? (
                            <img 
                                src={product.images[0].url} 
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#958EA0]">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                            <label className="w-full py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-colors text-center cursor-pointer block">
                                Edit Main Image
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            setProduct({ ...product, images: [{ url, file }] });
                                        }
                                    }} 
                                />
                            </label>
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 tracking-tight text-white/90">{product.title}</h2>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-6 flex items-center gap-1">
                        <span className="text-xl font-medium">{product.price?.currency === 'INR' ? '₹' : product.price?.currency}</span>
                        {product.price?.amount}
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-[#958EA0] uppercase tracking-wider text-[11px] font-bold mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                                Description
                            </h3>
                            <p className="text-[#cbc3d7] text-sm leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Variants & Stock */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-[#121214]/60 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                    <div className="flex sm:flex-row flex-col sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Product Variants</h2>
                            <p className="text-sm text-[#958EA0] mt-1">Manage colors, sizes, and inventory allocations.</p>
                        </div>
                        <button 
                            onClick={() => setShowVariantForm(!showVariantForm)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0"
                        >
                            <svg className={`w-4 h-4 transition-transform ${showVariantForm ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            {showVariantForm ? 'Cancel' : 'Add New Variant'}
                        </button>
                    </div>

                    {showVariantForm && (
                        <div className="mb-10 p-6 bg-[#1A1C1D] border border-purple-500/30 rounded-2xl shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                            <h3 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
                                New Variant Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                <div className="md:col-span-2 flex gap-4 items-center">
                                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 bg-black/30 flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer hover:border-purple-500/50 transition-colors">
                                        {newVariant.images[0].url ? (
                                            <img src={newVariant.images[0].url} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-6 h-6 text-[#958EA0] group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        )}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    // FIX: Add 'file' property so it can be sent via FormData
                                                    setNewVariant({...newVariant, images: [{ url, file }]});
                                                }
                                            }} 
                                        />
                                    </label>
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#958EA0] mb-1.5">Image URL</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-[#0C0E0F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-white/20"
                                            placeholder="Paste image URL here..."
                                            value={newVariant.images[0].url}
                                            onChange={e => setNewVariant({...newVariant, images: [{url: e.target.value}]})}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-xs font-bold uppercase text-[#958EA0] mb-2">Attributes</h4>
                                    <div>
                                        <label className="block text-xs font-medium text-[#958EA0] mb-1.5">Size / Dimensions</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-[#0C0E0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="e.g., XL, Medium, 10 UK"
                                            value={newVariant.attributes.size}
                                            onChange={e => setNewVariant({...newVariant, attributes: {...newVariant.attributes, size: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#958EA0] mb-1.5">Color</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-[#0C0E0F] border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="e.g., Midnight Black, Crimson"
                                            value={newVariant.attributes.color}
                                            onChange={e => setNewVariant({...newVariant, attributes: {...newVariant.attributes, color: e.target.value}})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-xs font-bold uppercase text-[#958EA0] mb-2">Inventory & Pricing</h4>
                                    <div>
                                        <label className="block text-xs font-medium text-[#958EA0] mb-1.5">Available Stock</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                className="w-full bg-[#0C0E0F] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
                                                value={newVariant.stock}
                                                onChange={e => setNewVariant({...newVariant, stock: parseInt(e.target.value) || 0})}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#958EA0]">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#958EA0] mb-1.5">Price Amount ({newVariant.price.currency})</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                className="w-full bg-[#0C0E0F] border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
                                                value={newVariant.price.amount}
                                                onChange={e => setNewVariant({...newVariant, price: {...newVariant.price, amount: parseInt(e.target.value) || 0}})}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#958EA0] font-medium">
                                                {newVariant.price.currency === 'INR' ? '₹' : '$'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button onClick={() => setShowVariantForm(false)} className="px-5 py-2.5 bg-transparent text-[#958EA0] hover:text-white rounded-xl text-sm font-semibold transition-colors">Discard</button>
                                <button onClick={handleAddVariant} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-purple-500/20">Add Variant to Listing</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {(!product.varients || product.varients.length === 0) && !showVariantForm ? (
                            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#958EA0]">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">No Variants Found</h3>
                                <p className="text-[#958EA0] text-sm text-center max-w-sm">You haven't added any variants for this product yet. Click "Add New Variant" to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {product.varients?.map((variant, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 bg-[#1A1C1D] border border-white/5 rounded-2xl hover:border-purple-500/30 transition-all group hover:bg-[#1f2122] shadow-sm">
                                        <div className="w-20 h-20 rounded-xl bg-black/50 overflow-hidden shrink-0 border border-white/10 relative">
                                            {variant.images?.[0]?.url ? (
                                                <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#958EA0]">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {variant.attributes && Object.entries(variant.attributes).map(([key, val]) => {
                                                    if(!val) return null;
                                                    return (
                                                        <span key={key} className="px-2.5 py-1 bg-purple-500/10 text-purple-300 text-[11px] font-bold uppercase tracking-wider rounded-md border border-purple-500/20">
                                                            {key}: {val}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                            <div className="text-lg font-bold text-white flex items-center gap-1.5">
                                                <span className="text-[#958EA0] font-normal text-sm">Price:</span> 
                                                {variant.price?.currency === 'INR' ? '₹' : variant.price?.currency} {variant.price?.amount}
                                            </div>
                                        </div>
                                        
                                        <div className="flex sm:flex-col flex-row items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto">
                                            <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/10">
                                                <span className="text-xs font-semibold uppercase text-[#958EA0] pl-2">Stock</span>
                                                <input 
                                                    type="number" 
                                                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-purple-500 focus:bg-[#1A1A1C] transition-all font-mono text-white"
                                                    value={variant.stock || 0}
                                                    onChange={(e) => handleVariantStockChange(idx, e.target.value)}
                                                />
                                            </div>
                                            <button className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default SellerProductDetails;