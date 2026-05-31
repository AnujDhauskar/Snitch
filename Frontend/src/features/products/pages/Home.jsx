import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useproduct'

const Home = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const [activeCategory, setActiveCategory] = useState('All');
    const [moreOpen, setMoreOpen] = useState(false);

    const mainCategories = ['All', 'Shirts', 'T-Shirts', 'Jeans', 'Cargo', 'Trousers'];
    const moreCategories = ['Jackets', 'Hoodies', 'Shorts', 'Kurtas', 'Ethnic Wear', 'Accessories'];

    useEffect(() => {
        handleGetAllProducts();
    }, [handleGetAllProducts]);

  return (
    <div className="min-h-screen font-sans" style={{ background: '#09090B', color: '#E5E1E4' }}>

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Navbar */}
      <nav style={{
        width: '100%', padding: '0 4rem',
        height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase', fontFamily: 'serif' }}>
          SNITCH
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Search */}
          <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 10px', color: '#958EA0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#958EA0'; }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* Cart */}
          <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 10px', color: '#958EA0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#958EA0'; }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>

          {/* Shop Now CTA */}
          <button style={{
            background: '#8B5CF6', color: '#fff', border: 'none',
            borderRadius: '24px', padding: '8px 20px',
            fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.08em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.3)'; }}>
            Shop Now
          </button>
        </div>
      </nav>

      {/* Category Navigation Bar */}
      <div style={{
        width: '100%',
        background: 'rgba(18,18,20,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: '72px', zIndex: 49,
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 4rem',
          display: 'flex', alignItems: 'center', gap: '0',
          minWidth: 'max-content',
        }}>
          {mainCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none', border: 'none',
                padding: '1rem 1.25rem',
                fontSize: '0.75rem', fontWeight: activeCategory === cat ? '700' : '500',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: activeCategory === cat ? '#DDD6FE' : '#958EA0',
                cursor: 'pointer', transition: 'all 0.2s',
                position: 'relative', whiteSpace: 'nowrap',
                borderBottom: activeCategory === cat
                  ? '2px solid #8B5CF6'
                  : '2px solid transparent',
              }}
              onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.color = '#E5E1E4'; } }}
              onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.color = '#958EA0'; } }}
            >
              {cat}
              {activeCategory === cat && (
                <span style={{
                  position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)',
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#8B5CF6',
                  boxShadow: '0 0 8px rgba(139,92,246,0.8)',
                }} />
              )}
            </button>
          ))}

          {/* More dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreOpen(o => !o)}
              style={{
                background: 'none', border: 'none',
                padding: '1rem 1.25rem',
                fontSize: '0.75rem', fontWeight: '500',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: moreOpen ? '#DDD6FE' : '#958EA0',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '4px',
                borderBottom: '2px solid transparent',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!moreOpen) e.currentTarget.style.color = '#E5E1E4'; }}
              onMouseLeave={e => { if (!moreOpen) e.currentTarget.style.color = '#958EA0'; }}
            >
              More
              <svg
                width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ transition: 'transform 0.2s', transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {moreOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 48 }}
                  onClick={() => setMoreOpen(false)}
                />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#121214',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '0.5rem',
                  minWidth: '160px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.08)',
                  zIndex: 49,
                  animation: 'fadeInDown 0.15s ease',
                }}>
                  {moreCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setMoreOpen(false); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        background: activeCategory === cat ? 'rgba(139,92,246,0.12)' : 'none',
                        border: 'none', borderRadius: '10px',
                        padding: '0.65rem 1rem',
                        fontSize: '0.78rem', fontWeight: activeCategory === cat ? '700' : '400',
                        letterSpacing: '0.05em',
                        color: activeCategory === cat ? '#DDD6FE' : '#958EA0',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#E5E1E4'; } }}
                      onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#958EA0'; } }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Active category badge (right side) */}
          {activeCategory !== 'All' && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '24px', padding: '3px 12px',
                fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#DDD6FE',
              }}>
                {activeCategory}
              </span>
              <button
                onClick={() => setActiveCategory('All')}
                style={{
                  background: 'none', border: 'none', color: '#494454',
                  cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
                  padding: '0', display: 'flex', alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#958EA0'}
                onMouseLeave={e => e.currentTarget.style.color = '#494454'}
                title="Clear filter"
              >×</button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <header style={{ position: 'relative', maxWidth: '1600px', margin: '0 auto', padding: '5rem 4rem 6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center', overflow: 'hidden', zIndex: 1 }}>

        {/* Large background text */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(8rem, 20vw, 22rem)', fontWeight: '900', fontFamily: 'serif',
          color: 'rgba(255,255,255,0.02)', letterSpacing: '-0.05em', textTransform: 'uppercase',
          userSelect: 'none', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0
        }}>SNITCH</div>

        {/* Left headline */}
        <div style={{ position: 'absolute', left: '4rem', top: '28%', zIndex: 10 }}>
          <h1 style={{ fontSize: 'clamp(4rem, 8vw, 9rem)', lineHeight: '0.85', fontFamily: 'serif', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            <span style={{ display: 'block' }}>Your</span>
            <span style={{ display: 'block', marginLeft: '3rem', WebkitTextStroke: '1px rgba(139,92,246,0.5)', color: 'transparent', backgroundImage: 'linear-gradient(135deg, #8B5CF6, #DDD6FE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Next</span>
          </h1>
        </div>

        {/* Center image */}
        <div style={{
          position: 'relative', zIndex: 5,
          width: '420px', maxWidth: '90vw', height: '600px',
          borderRadius: '999px 999px 0 0',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#121214',
          boxShadow: '0 0 80px rgba(139,92,246,0.12), 0 40px 80px rgba(0,0,0,0.6)'
        }}>
          <img
            src="/hero-light.png"
            alt="Editorial Model"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', mixBlendMode: 'luminosity', opacity: 0.85 }}
          />
          {/* Purple gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(9,9,11,0.9), transparent)'
          }} />
        </div>

        {/* Right headline */}
        <div style={{ position: 'absolute', right: '4rem', top: '35%', zIndex: 10, textAlign: 'right' }}>
          <h1 style={{ fontSize: 'clamp(4rem, 8vw, 9rem)', lineHeight: '0.85', fontFamily: 'serif', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            <span style={{ display: 'block' }}>Looks</span>
            <span style={{ display: 'block', backgroundImage: 'linear-gradient(135deg, #DDD6FE, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Awaits</span>
          </h1>
        </div>

        {/* Description pill */}
        <div style={{
          position: 'absolute', bottom: '3rem', left: '4rem', zIndex: 10,
          background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '16px', padding: '1rem 1.5rem', maxWidth: '320px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ color: '#958EA0', fontSize: '0.8rem', lineHeight: '1.7', margin: 0 }}>
            Find the outfits that feel effortless, confident, and true to who you are. Your style story starts here.
          </p>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '3rem', right: '4rem', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
        }}>
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.5))' }} />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#494454' }}>Scroll</span>
        </div>
      </header>

      {/* Features Bar */}
      <div style={{
        background: '#121214', borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '4rem',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
          {[
            { title: 'Free Shipping', desc: 'Complimentary delivery on all orders, no minimum required.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
            { title: 'Customer Support', desc: 'Friendly assistance whenever you need it.', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Secure Payment', desc: 'Your transactions are encrypted and fully protected.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { title: 'Seamless Shopping', desc: 'A smooth, effortless, and enjoyable shopping experience.', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' }
          ].map((feature, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
              }}>
                <svg width="18" height="18" fill="none" stroke="#8B5CF6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'serif', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem', color: '#E5E1E4' }}>{feature.title}</h3>
              <p style={{ color: '#494454', fontSize: '0.75rem', lineHeight: '1.7', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <section id="products" style={{ padding: '6rem 4rem', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '24px', height: '1px', background: '#8B5CF6' }} />
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B5CF6', fontWeight: '600' }}>New Collection</span>
            </div>
            <h2 style={{ fontFamily: 'serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: '1.15', margin: 0, fontWeight: '700' }}>
              Bespoke, High-Quality<br />
              <span style={{ backgroundImage: 'linear-gradient(135deg, #DDD6FE, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clothing By SNITCH</span>
            </h2>
            <p style={{ color: '#494454', fontSize: '0.8rem', lineHeight: '1.8', maxWidth: '480px', marginTop: '1rem', marginBottom: 0 }}>
              A curated selection that captures the essence of the season — clean lines, elevated textures, and understated elegance.
            </p>
          </div>
          <button style={{
            background: 'transparent', color: '#DDD6FE',
            border: '1px solid rgba(139,92,246,0.4)', borderRadius: '24px',
            padding: '12px 28px', fontSize: '0.7rem', fontWeight: '600',
            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#8B5CF6'; e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.color = '#DDD6FE'; e.currentTarget.style.boxShadow = 'none'; }}>
            See All Collections
          </button>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map((product, index) => (
              <div
                key={product._id}
                style={{
                  background: '#121214', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
                  transition: 'all 0.35s ease', position: 'relative',
                  marginTop: index % 2 !== 0 ? '2rem' : '0'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#1a1a1e' }}>
                  <img
                    src={product.images && product.images.length > 0 ? (product.images[0].url || product.images[0]) : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {/* Subtle overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.7) 0%, transparent 50%)' }} />

                  {/* Quick add button */}
                  <div style={{
                    position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(139,92,246,0.9)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(139,92,246,0.5)',
                    borderRadius: '24px', padding: '8px 20px',
                    fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap',
                    opacity: 0, transition: 'opacity 0.3s',
                    cursor: 'pointer', zIndex: 5
                  }}
                    className="quick-add-btn">
                    Quick Add
                  </div>
                </div>

                {/* Product details */}
                <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontFamily: 'serif', color: '#E5E1E4', margin: 0, lineHeight: '1.4', fontWeight: '500' }}>{product.title}</h3>
                    <span style={{ fontSize: '0.9rem', color: '#8B5CF6', fontWeight: '700', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {product.price?.currency === 'INR' ? '₹' : (product.price?.currency || '$')}{product.price?.amount}
                    </span>
                  </div>
                  {product.category && (
                    <span style={{ display: 'inline-block', marginTop: '0.6rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#494454' }}>
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '6rem 2rem',
            background: '#121214', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px', textAlign: 'center'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="28" height="28" fill="none" stroke="#8B5CF6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p style={{ fontSize: '1.2rem', fontFamily: 'serif', color: '#494454', margin: 0 }}>No collections available yet.</p>
            <p style={{ fontSize: '0.8rem', color: '#494454', marginTop: '0.5rem' }}>Check back soon for new arrivals.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        background: '#121214', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '4rem 4rem 2rem', marginTop: '4rem', position: 'relative', zIndex: 1
      }}>
        {/* Purple glow at top */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.5), transparent)'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '3rem', marginBottom: '4rem' }}>
            {/* Brand */}
            <div style={{ minWidth: '220px' }}>
              <div style={{ fontSize: '1.5rem', fontFamily: 'serif', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff', marginBottom: '1rem' }}>SNITCH</div>
              <p style={{ color: '#494454', fontSize: '0.78rem', lineHeight: '1.8', maxWidth: '260px', margin: 0 }}>
                Redefining modern elegance with clean lines, elevated textures, and effortless style.
              </p>
              {/* Purple divider */}
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(to right, #8B5CF6, transparent)', marginTop: '1.5rem', borderRadius: '2px' }} />
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B5CF6', fontWeight: '700', marginBottom: '1.25rem' }}>Shop</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {['Collections', 'New Arrivals', 'Sale', 'Journal'].map(item => (
                    <li key={item}>
                      <a href="#" style={{ color: '#958EA0', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#DDD6FE'}
                        onMouseLeave={e => e.currentTarget.style.color = '#958EA0'}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B5CF6', fontWeight: '700', marginBottom: '1.25rem' }}>Support</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {['Contact', 'Shipping', 'Returns', 'FAQ'].map(item => (
                    <li key={item}>
                      <a href="#" style={{ color: '#958EA0', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#DDD6FE'}
                        onMouseLeave={e => e.currentTarget.style.color = '#958EA0'}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '1rem'
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#494454', margin: 0 }}>
              © {new Date().getFullYear()} SNITCH. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy', 'Terms', 'Cookies'].map(item => (
                <a key={item} href="#" style={{ fontSize: '0.65rem', color: '#494454', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#958EA0'}
                  onMouseLeave={e => e.currentTarget.style.color = '#494454'}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .group:hover .quick-add-btn,
        div:hover .quick-add-btn {
          opacity: 1 !important;
        }
        * { box-sizing: border-box; }
        ::selection { background: rgba(139,92,246,0.3); color: #fff; }
      `}</style>
    </div>
  )
}

export default Home