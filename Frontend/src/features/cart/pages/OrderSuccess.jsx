import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Mini confetti canvas effect ---
function ConfettiCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#8B5CF6', '#A78BFA', '#7C3AED', '#C4B5FD', '#fff', '#DDD6FE'];
    const pieces = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 3 + 1.5,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 4,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    let frame;
    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;
      pieces.forEach(p => {
        p.y += p.speed;
        p.angle += p.spin;
        p.opacity = Math.max(0, p.opacity - (tick > 120 ? 0.005 : 0));
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.opacity = 0.5;
        }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (tick < 220) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// --- Tracking step component ---
function TrackStep({ icon, label, date, desc, done, active, last }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
          style={{
            background: done || active
              ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
              : 'rgba(255,255,255,0.04)',
            border: active
              ? '2px solid #A78BFA'
              : done
                ? '2px solid #7C3AED'
                : '1px solid rgba(255,255,255,0.08)',
            boxShadow: active ? '0 0 20px rgba(139,92,246,0.5)' : 'none',
          }}
        >
          {icon}
        </div>
        {!last && (
          <div
            className="w-0.5 flex-1 mt-1"
            style={{
              minHeight: '40px',
              background: done
                ? 'linear-gradient(to bottom, #7C3AED, rgba(139,92,246,0.2))'
                : 'rgba(255,255,255,0.06)',
            }}
          />
        )}
      </div>
      <div className="pb-8 pt-1">
        <div className="flex items-center gap-3 mb-1">
          <p
            className="font-semibold text-sm"
            style={{ color: done || active ? '#E5E1E4' : '#635E6E' }}
          >
            {label}
          </p>
          {active && (
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.35)' }}
            >
              Current
            </span>
          )}
        </div>
        {date && (
          <p className="text-xs mb-1" style={{ color: '#8B5CF6' }}>{date}</p>
        )}
        {desc && (
          <p className="text-xs" style={{ color: '#635E6E' }}>{desc}</p>
        )}
      </div>
    </div>
  );
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const today = new Date();
  const fmt = (d) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const addDays = (d, n) => {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
  };

  const trackingSteps = [
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: 'Order Confirmed',
      date: fmt(today),
      desc: 'Your payment was received and order is confirmed.',
      done: true,
      active: false,
    },
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
        </svg>
      ),
      label: 'Processing & Packing',
      date: fmt(addDays(today, 1)),
      desc: 'Your items are being picked and packed at our warehouse.',
      done: false,
      active: true,
    },
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      label: 'Shipped',
      date: fmt(addDays(today, 2)),
      desc: 'Your order has been handed over to the courier partner.',
      done: false,
      active: false,
    },
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Out for Delivery',
      date: fmt(addDays(today, 4)),
      desc: 'The courier is on the way to your delivery address.',
      done: false,
      active: false,
    },
    {
      icon: (
        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Delivered',
      date: fmt(addDays(today, 5)),
      desc: 'Expected delivery by this date.',
      done: false,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: '#09090B', color: '#E5E1E4' }}>
      <ConfettiCanvas />

      {/* Ambient glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '800px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between w-full px-8 md:px-16"
        style={{
          height: '72px',
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="flex items-center gap-2 cursor-pointer transition-opacity duration-200 opacity-90 hover:opacity-100"
          onClick={() => navigate('/')}
        >
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <rect x="8" y="30" width="84" height="12" rx="6" fill="white" />
            <rect x="8" y="58" width="84" height="12" rx="6" fill="white" />
            <rect x="30" y="8" width="12" height="84" rx="6" fill="white" />
            <rect x="58" y="8" width="12" height="84" rx="6" fill="white" />
          </svg>
          <span
            className="uppercase font-black text-white hidden sm:block"
            style={{ fontSize: '1.15rem', letterSpacing: '0.18em', fontFamily: 'serif', lineHeight: 1 }}
          >
            SNITCH
          </span>
        </div>
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
          Continue Shopping
        </button>
      </nav>

      {/* Main */}
      <main
        className="relative z-10 px-4 sm:px-8 md:px-16 py-14"
        style={{
          maxWidth: '1100px', margin: '0 auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
        }}
      >
        {/* Hero success badge */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="relative mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                boxShadow: '0 0 60px rgba(139,92,246,0.45)',
              }}
            >
              <svg width="44" height="44" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(139,92,246,0.2)', animationDuration: '1.8s' }}
            />
          </div>

          <h1
            className="font-black text-white mb-3"
            style={{ fontFamily: 'serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}
          >
            Payment Successful!
          </h1>
          <p style={{ color: '#958EA0', fontSize: '1.05rem', maxWidth: '500px' }}>
            Thank you for your order. We've received your payment and are already getting things ready for you.
          </p>

          {orderId && (
            <div
              className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              <svg width="16" height="16" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span style={{ color: '#958EA0', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Order ID:</span>
              <span
                className="font-mono font-bold"
                style={{ color: '#A78BFA', fontSize: '0.85rem', letterSpacing: '0.05em' }}
              >
                {orderId}
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(orderId)}
                title="Copy Order ID"
                className="ml-1 transition-opacity hover:opacity-60"
              >
                <svg width="14" height="14" fill="none" stroke="#635E6E" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Order Tracking */}
          <div className="lg:col-span-3">
            <div
              className="p-7 rounded-3xl"
              style={{
                background: 'rgba(18,18,20,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  <svg width="16" height="16" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h2 className="font-bold text-lg" style={{ color: '#E5E1E4', letterSpacing: '-0.01em' }}>
                  Track Your Order
                </h2>
              </div>

              {trackingSteps.map((step, i) => (
                <TrackStep
                  key={i}
                  {...step}
                  last={i === trackingSteps.length - 1}
                />
              ))}

              {/* Estimated delivery banner */}
              <div
                className="mt-2 flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.2)',
                }}
              >
                <svg width="22" height="22" fill="none" stroke="#8B5CF6" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#8B5CF6' }}>
                    Estimated Delivery
                  </p>
                  <p className="font-bold" style={{ color: '#E5E1E4', fontSize: '1rem' }}>
                    {fmt(addDays(today, 4))} – {fmt(addDays(today, 5))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Payment Confirmed Card */}
            <div
              className="p-6 rounded-3xl"
              style={{
                background: 'rgba(18,18,20,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <svg width="16" height="16" fill="none" stroke="#4ADE80" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold" style={{ color: '#E5E1E4', fontSize: '0.95rem' }}>
                  Payment Confirmed
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Status', value: 'Paid', color: '#4ADE80' },
                  { label: 'Method', value: 'Razorpay' },
                  { label: 'Date', value: fmt(today) },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span style={{ color: '#635E6E', fontSize: '0.8rem' }}>{label}</span>
                    <span className="font-semibold text-sm" style={{ color: color || '#E5E1E4' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's next Card */}
            <div
              className="p-6 rounded-3xl"
              style={{
                background: 'rgba(18,18,20,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  <svg width="16" height="16" fill="none" stroke="#A78BFA" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold" style={{ color: '#E5E1E4', fontSize: '0.95rem' }}>
                  What Happens Next?
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  'A confirmation email will be sent to you shortly.',
                  'Our team will pack your order within 24 hours.',
                  "You'll get a tracking link once your order ships.",
                  "Sit back and relax — we've got you covered!",
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA' }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: '#958EA0', fontSize: '0.82rem', lineHeight: 1.55 }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-2xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                  border: 'none',
                  color: '#fff',
                  padding: '15px 24px',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #6D28D9)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6, #7C3AED)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.3)'; }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Shop More
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 font-semibold text-sm rounded-2xl transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#958EA0',
                  padding: '13px 24px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.color = '#E5E1E4'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#958EA0'; }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 px-16 py-10 mt-16"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="text-center"
          style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#494454' }}
        >
          © {new Date().getFullYear()} SNITCH. All rights reserved.
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: rgba(139,92,246,0.3); color: #fff; }
      `}</style>
    </div>
  );
};

export default OrderSuccess;