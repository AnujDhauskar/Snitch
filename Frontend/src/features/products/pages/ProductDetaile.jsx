import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useproduct';
import { useCart } from '../../cart/hook/useCart';

const ProductDetaile = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { handleGetProductById } = useProduct();
  const {handleAddItem, handleGetCart} = useCart();
  const cartItems = useSelector(state => state.cart?.items || []);

  useEffect(() => {
    handleGetCart();
  }, []);

  async function fetchProductDetails() {
    const data = await handleGetProductById(productId);
    setProduct(data);
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Fallback product data if API hasn't returned yet
  const displayProduct = product || {
    price: { amount: 999, currency: 'INR' },
    _id: '6a1c139b9047c562e448fe46',
    title: 'White Fabric Shirt',
    description: 'Clean look',
    images: [
      {
        url: 'https://ik.imagekit.io/xfgbpm21y/snitch/mahdi-bafande-npyWFYpHQ94-unsplash_A6fxKVb_R.jpg',
        _id: '6a1c139b9047c562e448fe47',
      },
    ],
    createdAt: '2026-05-31T10:55:23.674Z',
    varients: []
  };

  const variants = displayProduct.varients || [];

  // Case-insensitive attribute getter — Mongoose Maps can serialize keys with any casing
  const getAttr = (attributes, key) => {
    if (!attributes) return undefined;
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(attributes).find(k => k.toLowerCase() === lowerKey);
    return foundKey ? attributes[foundKey] : undefined;
  };

  const availableSizes = [...new Set(variants.map(v => getAttr(v.attributes, 'size')).filter(Boolean))];
  let colors = [...new Set(variants.map(v => getAttr(v.attributes, 'color')).filter(Boolean))];

  const titleLower = (displayProduct.title || '').toLowerCase();
  const knownColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'navy', 'grey', 'gray', 'maroon', 'pink', 'purple', 'brown', 'olive', 'teal', 'mustard'];
  const inferredBaseColor = knownColors.find(c => titleLower.includes(c));

  if (inferredBaseColor && !colors.some(c => c.toLowerCase() === inferredBaseColor)) {
    const capitalizedColor = inferredBaseColor.charAt(0).toUpperCase() + inferredBaseColor.slice(1);
    colors.unshift(capitalizedColor);
  }

  // Compute available sizes based on the currently selected color
  let sizesForSelectedColor = [];
  if (selectedColor) {
    const variantsWithColor = variants.filter(v => {
      const vColor = getAttr(v.attributes, 'color');
      return vColor && vColor.toLowerCase() === selectedColor.toLowerCase();
    });
    
    if (variantsWithColor.length > 0) {
      sizesForSelectedColor = variantsWithColor.map(v => getAttr(v.attributes, 'size')).filter(Boolean);
    } else if (inferredBaseColor && selectedColor.toLowerCase() === inferredBaseColor.toLowerCase()) {
      sizesForSelectedColor = ['XL']; // Default for the base inferred product
    }
  }

  const sizes = sizesForSelectedColor.length > 0 
    ? [...new Set(sizesForSelectedColor)] 
    : [...new Set([...availableSizes, 'L', 'XL'])];

  // Auto-select color once variants are loaded
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [product, colors, selectedColor]);

  // Auto-update selected size when available sizes for the selected color change
  useEffect(() => {
    if (sizes.length > 0 && (!selectedSize || !sizes.includes(selectedSize))) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, selectedSize]);

  // Find variant matching both size and color (if colors exist), else just size
  const selectedVariant = variants.find(v => {
    const vSize = getAttr(v.attributes, 'size');
    const vColor = getAttr(v.attributes, 'color');
    const sizeMatch = !selectedSize || (vSize && vSize.toLowerCase() === selectedSize.toLowerCase());
    const colorMatch = colors.length === 0 || !selectedColor || (vColor && vColor.toLowerCase() === selectedColor.toLowerCase());
    return sizeMatch && colorMatch;
  });

  // Find a variant that matches the selected color, regardless of size, to guarantee the correct color image
  const colorVariant = variants.find(v => {
    const vColor = getAttr(v.attributes, 'color');
    return vColor && selectedColor && vColor.toLowerCase() === selectedColor.toLowerCase();
  });

  // Use selected variant image, OR color-matched variant image, OR fallback to base product image
  const variantImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : [];
  const colorImages = colorVariant?.images?.length > 0 ? colorVariant.images : [];
  const productImages = displayProduct.images?.length > 0 ? displayProduct.images : [];
  
  const images = variantImages.length > 0 ? variantImages 
    : (colorImages.length > 0 ? colorImages 
    : (productImages.length > 0 ? productImages : [{ url: 'https://ik.imagekit.io/xfgbpm21y/snitch/mahdi-bafande-npyWFYpHQ94-unsplash_A6fxKVb_R.jpg', _id: 'fallback' }]));

  const displayPrice = selectedVariant?.price?.amount || displayProduct.price?.amount || 0;
  const currencySymbol = selectedVariant?.price?.currency === 'INR' ? '₹' : (displayProduct.price?.currency === 'INR' ? '₹' : '$');

  return (
    <div className="min-h-screen font-sans" style={{ background: '#09090B', color: '#E5E1E4' }}>

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '700px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between w-full px-16"
        style={{
          height: '72px',
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-opacity duration-200 opacity-90 hover:opacity-100"
          onClick={() => navigate('/')}
        >
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="30" width="84" height="12" rx="6" fill="white" />
            <rect x="8" y="58" width="84" height="12" rx="6" fill="white" />
            <rect x="30" y="8" width="12" height="84" rx="6" fill="white" />
            <rect x="58" y="8" width="12" height="84" rx="6" fill="white" />
          </svg>
          <span
            className="uppercase font-black text-white"
            style={{ fontSize: '1.15rem', letterSpacing: '0.18em', fontFamily: 'serif', lineHeight: 1 }}
          >
            SNITCH
          </span>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <button
            className="flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#958EA0' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#958EA0'; }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#958EA0' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#958EA0'; }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>

          {/* Back CTA */}
          <button
            onClick={() => navigate('/')}
            className="text-white rounded-full text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all duration-200"
            style={{
              background: '#8B5CF6', border: 'none',
              padding: '8px 20px',
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.3)'; }}
          >
            Shop More
          </button>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="relative z-10 px-16 pt-6 pb-2" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="flex items-center gap-2" style={{ color: '#494454', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span
            className="cursor-pointer transition-colors duration-200 hover:text-purple-400"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span style={{ color: '#2a2a30' }}>/</span>
          <span style={{ color: '#958EA0' }}>{displayProduct.title}</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="relative z-10 px-16 py-10" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="grid gap-16" style={{ gridTemplateColumns: '1fr 1fr' }}>

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                aspectRatio: '3/4',
                background: '#121214',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.08)',
              }}
            >
              <img
                src={images[activeImg]?.url || images[0]?.url}
                alt={displayProduct.title}
                className="w-full h-full object-cover object-top transition-transform duration-700"
                style={{ mixBlendMode: 'normal' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Gradient overlay bottom */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ height: '35%', background: 'linear-gradient(to top, rgba(9,9,11,0.75), transparent)' }}
              />

              {/* NEW badge */}
              <div
                className="absolute top-4 left-4 text-white font-bold tracking-widest uppercase"
                style={{
                  background: 'rgba(139,92,246,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139,92,246,0.5)',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                }}
              >
                New Arrival
              </div>

              {/* Wishlist button */}
              <button
                className="absolute top-4 right-4 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  width: '38px', height: '38px',
                  background: 'rgba(9,9,11,0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#958EA0',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#8B5CF6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#958EA0'; }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Thumbnail strip (if multiple images) */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img._id || idx}
                    onClick={() => setActiveImg(idx)}
                    className="relative overflow-hidden rounded-xl transition-all duration-200"
                    style={{
                      width: '72px', height: '90px', flexShrink: 0,
                      border: activeImg === idx ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.06)',
                      background: '#121214',
                      boxShadow: activeImg === idx ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
                    }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">

              {/* Label */}
              <div className="flex items-center gap-3">
                <div style={{ width: '24px', height: '1px', background: '#8B5CF6' }} />
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B5CF6', fontWeight: '600' }}>
                  SNITCH Collection
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-bold text-white leading-tight"
                style={{ fontFamily: 'serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.01em' }}
              >
                {displayProduct.title}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= 4 ? '#8B5CF6' : 'none'} stroke="#8B5CF6" strokeWidth="1.5">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#958EA0', letterSpacing: '0.05em' }}>4.8 · 124 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span
                  className="font-bold"
                  style={{ fontSize: '2.4rem', color: '#8B5CF6', fontFamily: 'serif', letterSpacing: '-0.02em' }}
                >
                  {currencySymbol}{displayPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '1rem', color: '#494454', textDecoration: 'line-through' }}>
                  {currencySymbol}{Math.round(displayPrice * 1.3).toLocaleString('en-IN')}
                </span>
                <span
                  className="font-semibold text-xs uppercase tracking-wider rounded-full px-3 py-1"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#DDD6FE' }}
                >
                  23% OFF
                </span>
              </div>

              {/* Description */}
              <div
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p style={{ color: '#958EA0', fontSize: '0.85rem', lineHeight: '1.8', margin: 0 }}>
                  {displayProduct.description && displayProduct.description.trim().length > 10
                    ? displayProduct.description
                    : 'A timeless piece crafted for the modern wardrobe. Clean silhouette, premium fabric, effortless versatility — from morning to night.'}
                </p>
              </div>

              {/* Color Selector */}
              {colors.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#958EA0', fontWeight: '600' }}>
                    Select Color
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => {
                    const isSelected = selectedColor === color;
                    // Try to use the color name as a CSS color for the swatch dot
                    const swatchStyle = { width: '12px', height: '12px', borderRadius: '50%', background: color.toLowerCase(), border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 };
                    return (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setActiveImg(0); }}
                      className="flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 px-4 py-2"
                      style={{
                        fontSize: '0.8rem', letterSpacing: '0.05em',
                        border: isSelected ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                        color: isSelected ? '#DDD6FE' : '#958EA0',
                        boxShadow: isSelected ? '0 0 16px rgba(139,92,246,0.25)' : 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                          e.currentTarget.style.color = '#E5E1E4';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.color = '#958EA0';
                        }
                      }}
                    >
                      <span style={swatchStyle} />
                      {color}
                    </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Size Selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#958EA0', fontWeight: '600' }}>
                    Select Size
                  </span>
                  <span
                    className="cursor-pointer transition-colors duration-200"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B5CF6', fontWeight: '500' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#DDD6FE'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8B5CF6'}
                  >
                    Size Guide
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="flex items-center justify-center rounded-xl font-semibold transition-all duration-200"
                      style={{
                        width: '52px', height: '52px',
                        fontSize: '0.8rem', letterSpacing: '0.05em',
                        border: selectedSize === size
                          ? '2px solid #8B5CF6'
                          : '1px solid rgba(255,255,255,0.08)',
                        background: selectedSize === size
                          ? 'rgba(139,92,246,0.15)'
                          : 'rgba(255,255,255,0.03)',
                        color: selectedSize === size ? '#DDD6FE' : '#958EA0',
                        boxShadow: selectedSize === size ? '0 0 16px rgba(139,92,246,0.25)' : 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (selectedSize !== size) {
                          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                          e.currentTarget.style.color = '#E5E1E4';
                        }
                      }}
                      onMouseLeave={e => {
                        if (selectedSize !== size) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.color = '#958EA0';
                        }
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mt-2">
                {/* Buy Now */}
                <button
                  id="buy-now-btn"
                  className="flex-1 flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-2xl transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    border: 'none',
                    color: '#fff',
                    padding: '16px 28px',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(139,92,246,0.35), 0 8px 24px rgba(0,0,0,0.4)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #6D28D9)'; e.currentTarget.style.boxShadow = '0 0 45px rgba(139,92,246,0.55), 0 8px 32px rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6, #7C3AED)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.35), 0 8px 24px rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Buy Now
                </button>

                <button
                  id="add-to-cart-btn"
                  className="flex-1 flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-2xl transition-all duration-200"
                  style={{
                    background: (addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id)) ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.04)',
                    border: (addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id)) ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)',
                    color: (addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id)) ? '#DDD6FE' : '#E5E1E4',
                    padding: '16px 28px',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    boxShadow: (addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id)) ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!(addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id))) {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                      e.currentTarget.style.color = '#DDD6FE';
                      e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!(addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id))) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = '#E5E1E4';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}

                  onClick={async () => {
                    if (!selectedVariant) {
                      alert("This size and color combination is currently unavailable.");
                      return;
                    }
                    if (cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id)) {
                      navigate('/cart');
                      return;
                    }
                    try {
                      await handleAddItem({
                        productId: displayProduct._id,
                        varientId: selectedVariant._id
                      });
                      setAddedToCart(true);
                      handleGetCart();
                    } catch (err) {
                      console.error("Error adding to cart:", err);
                      alert("Failed to add item to cart.");
                    }
                  }}

                >
                  {(addedToCart || cartItems.some(i => i.product?._id === displayProduct?._id && i.variant === selectedVariant?._id)) ? (
                    <>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Go to Cart
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ── Trust Features ── */}
            <div
              className="grid grid-cols-3 gap-3 rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {[
                { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Free Delivery' },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure Pay' },
                { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Easy Returns' },
              ].map((feat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center py-2">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: '36px', height: '36px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <svg width="16" height="16" fill="none" stroke="#8B5CF6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feat.icon} />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#958EA0', fontWeight: '500' }}>
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Product meta */}
            <div className="flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
              <div className="flex gap-4">
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#494454', minWidth: '80px' }}>SKU</span>
                <span style={{ fontSize: '0.7rem', color: '#958EA0', fontFamily: 'monospace' }}>{displayProduct._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex gap-4">
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#494454', minWidth: '80px' }}>Added</span>
                <span style={{ fontSize: '0.7rem', color: '#958EA0' }}>
                  {new Date(displayProduct.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 px-16 py-10 mt-16"
        style={{ background: '#121214', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Top purple line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: '400px', height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.5), transparent)',
          }}
        />
        <div
          className="flex flex-wrap justify-between items-center gap-4"
          style={{ maxWidth: '1280px', margin: '0 auto' }}
        >
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#494454', margin: 0 }}>
            © {new Date().getFullYear()} SNITCH. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a
                key={item}
                href="#"
                style={{ fontSize: '0.65rem', color: '#494454', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                onMouseEnter={e => e.currentTarget.style.color = '#958EA0'}
                onMouseLeave={e => e.currentTarget.style.color = '#494454'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: rgba(139,92,246,0.3); color: #fff; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        main { animation: fadeIn 0.45s ease; }
      `}</style>
    </div>
  );
};

export default ProductDetaile;