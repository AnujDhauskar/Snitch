import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hook/useCart';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const { handleGetCart, handleRemoveItem, handleUpdateQuantity,handleCreateCartOrder,handleVerifyCartOrder } = useCart();
  const navigate = useNavigate();
  const { error,isLoading,Razorpay } = useRazorpay();
  const user = useSelector(state => state.user);

  useEffect(() => {
    handleGetCart();
  }, []);

  const formatCurrency = (amount, currency = 'INR') =>
    `${currency === 'INR' ? '₹' : currency + ' '}${Number(amount).toLocaleString('en-IN')}`;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price.amount * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  async function handleCheckOut(){
      const order = await handleCreateCartOrder();
      console.log(order);
       const options = {
      key: "rzp_test_T87nFugC5BI9rY",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async(response) => {
        const isValid = await handleVerifyCartOrder(response)
        if(isValid){
            navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
        }
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color:"#8B5CF6",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

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
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="flex items-center gap-6">
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-8 md:px-16 py-10" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h1
          className="font-bold text-white mb-10"
          style={{ fontFamily: 'serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.01em' }}
        >
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <svg width="64" height="64" fill="none" stroke="#958EA0" strokeWidth="1" viewBox="0 0 24 24" className="mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#E5E1E4' }}>Your cart is empty</h2>
            <p style={{ color: '#958EA0' }} className="mb-8">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate('/')}
              className="text-white rounded-xl text-sm font-bold uppercase tracking-widest cursor-pointer transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', border: 'none',
                padding: '14px 28px',
                boxShadow: '0 0 30px rgba(139,92,246,0.35)',
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cartItems.map((item) => {
                const product = item.product || {};
                const variantData = product.varients?.find(v => v._id === item.variant) || {};
                const attributes = variantData.attributes || {};
                const imageUrl = variantData.images?.[0]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/150';
                
                const displayPrice = item.price || { amount: 0, currency: 'INR' };
                const variantPrice = variantData.price || product.price || { amount: 0, currency: 'INR' };

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl transition-all duration-300 group"
                    style={{
                      background: 'rgba(18, 18, 20, 0.7)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    {/* Item Image */}
                    <div
                      className="relative overflow-hidden rounded-xl flex-shrink-0"
                      style={{ width: '120px', aspectRatio: '3/4', background: '#000' }}
                    >
                      <img src={imageUrl} alt={product.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="font-semibold text-lg leading-tight" style={{ color: '#E5E1E4' }}>
                            {product.title}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem({ productId: product._id, varientId: item.variant })}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                            title="Remove"
                          >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex gap-3 mb-4">
                          {attributes.color && (
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#958EA0', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              Color: <span style={{ color: '#E5E1E4' }}>{attributes.color}</span>
                            </span>
                          )}
                          {attributes.size && (
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#958EA0', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              Size: <span style={{ color: '#E5E1E4' }}>{attributes.size}</span>
                            </span>
                          )}
                        </div>

                        {displayPrice.amount !== variantPrice.amount && (
                          <div className="mb-2">
                            {displayPrice.amount > variantPrice.amount
                                ? <p className="text-[10px] uppercase tracking-[0.15em] text-green-400 font-bold" > you will get this at {formatCurrency(variantPrice.amount, variantPrice.currency)} save ₹{Math.abs(variantPrice.amount - displayPrice.amount)}.  </p>
                                : <p className="text-[10px] uppercase tracking-[0.15em] text-red-400 font-bold" > Warning this product will cost you ₹{Math.abs(variantPrice.amount - displayPrice.amount)} more.  </p>
                            }
                          </div>
                        )}
                        
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-4">
                          <span style={{ fontSize: '0.75rem', color: '#958EA0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</span>
                          <div className="flex items-center gap-3 rounded-lg px-2 py-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  handleUpdateQuantity({ productId: product._id, varientId: item.variant, quantity: item.quantity - 1 });
                                } else {
                                  handleRemoveItem({ productId: product._id, varientId: item.variant });
                                }
                              }}
                              className="text-gray-400 hover:text-white px-2 py-1 font-bold text-lg leading-none"
                            >
                              -
                            </button>
                            <span className="font-semibold text-md w-6 text-center text-white">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity({ productId: product._id, varientId: item.variant, quantity: item.quantity + 1 })}
                              className="text-gray-400 hover:text-white px-2 py-1 font-bold text-lg leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="font-bold tracking-tight" style={{ fontSize: '1.6rem', color: '#A78BFA' }}>
                          ₹{(item.price.amount * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-28 p-6 rounded-3xl"
                style={{
                  background: 'rgba(18, 18, 20, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                }}
              >
                <h2 className="font-bold text-xl mb-6" style={{ color: '#E5E1E4', letterSpacing: '-0.01em' }}>Order Summary</h2>
                
                <div className="flex flex-col gap-4 mb-6" style={{ fontSize: '0.9rem', color: '#958EA0' }}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span style={{ color: '#E5E1E4' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span style={{ color: '#E5E1E4' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span style={{ color: '#E5E1E4' }}>Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-4 mb-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="font-semibold" style={{ color: '#E5E1E4', fontSize: '1.1rem' }}>Total</span>
                    <span className="font-bold tracking-tight" style={{ fontSize: '2rem', color: '#A78BFA' }}>
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-2xl transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    border: 'none',
                    color: '#fff',
                    padding: '16px 28px',
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em',
                    boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #6D28D9)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6, #7C3AED)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.3)'; }}
                  onClick={handleCheckOut}
                >
                  Proceed to Checkout
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="mt-6 flex items-center justify-center gap-2" style={{ color: '#958EA0', fontSize: '0.7rem' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure SSL Encrypted Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer minimal */}
      <footer
        className="relative z-10 px-16 py-10 mt-16"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="text-center" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#494454' }}>
          © {new Date().getFullYear()} SNITCH. All rights reserved.
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

export default Cart;