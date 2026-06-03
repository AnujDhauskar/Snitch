import { useEffect } from 'react';
import { useProduct } from '../hook/useproduct';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProduct) || [];
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProduct();
    }, [handleGetSellerProduct]);

    const navItems = [
        { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', active: true },
        { name: 'Orders & Reviews', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Seller Tools', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { name: 'My Store', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Report', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Finance', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Referrals', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    return (
        <div className="flex h-screen bg-[#09090B] text-white font-sans overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-[280px] bg-[#121214]/95 border-r border-white/10 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                {/* Logo */}
                <div className="h-20 flex items-center px-8 border-b border-white/5">
                    <span className="text-2xl font-bold flex items-center gap-3 text-white tracking-tight">
                        <div className="flex flex-wrap gap-1 w-6 h-6 items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                        </div>
                        ecom
                    </span>
                </div>
                
                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <ul className="space-y-1.5">
                        {navItems.map((item, idx) => (
                            <li key={idx}>
                                <a 
                                    href="#" 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        item.active 
                                        ? 'bg-purple-500/10 text-purple-400 font-semibold' 
                                        : 'text-[#958EA0] hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    <span className="text-sm">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                {/* User Profile */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center overflow-hidden border border-white/20 shadow-md">
                            <img src="https://ui-avatars.com/api/?name=David+Mil&background=random" alt="David Mil" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">David Mil</p>
                            <p className="text-xs text-[#958EA0]">Seller Account</p>
                        </div>
                    </div>
                    <svg className="w-4 h-4 text-[#958EA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0a0c]">
                {/* Subtle Background pattern */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0a0c] to-[#0a0a0c] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                    
                    {/* Header */}
                    <header className="px-10 pt-10 pb-6 shrink-0 border-b border-white/5">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Products Dashboard</h1>
                                <div className="text-sm text-[#958EA0] flex items-center gap-2">
                                    <span>Products</span>
                                    <span>/</span>
                                    <span className="text-purple-400 font-medium">All Products</span>
                                </div>
                            </div>
                            <Link to="/seller/create-products" className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                Add new product
                            </Link>
                        </div>
                    </header>
                    
                    {/* Tabs */}
                    <div className="px-10 flex gap-8 border-b border-white/5 shrink-0">
                        {['All Products', 'Active', 'Drafts', 'Archived'].map((tab, idx) => (
                            <button 
                                key={idx}
                                className={`py-4 text-sm font-medium transition-all relative ${
                                    idx === 0 ? 'text-purple-400' : 'text-[#958EA0] hover:text-white'
                                }`}
                            >
                                {tab}
                                {idx === 0 && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Scrollable Area */}
                    <div className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        
                        <div className="bg-[#121214]/60 border border-white/5 rounded-3xl p-8 shadow-xl backdrop-blur-md">
                            <h2 className="text-lg font-semibold mb-6">Your Product Listings</h2>
                            
                            {sellerProducts.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center text-[#958EA0] border-2 border-dashed border-white/5 rounded-2xl">
                                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-lg">No products found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {sellerProducts.map((product) => (
                                        <div
                                        onClick={()=>{navigate(`/seller/product/${product._id}`)}}
                                         key={product._id} className="group bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col">
                                            {/* Product Image */}
                                            <div className="aspect-[4/3] w-full relative overflow-hidden bg-white/5 p-4 flex items-center justify-center">
                                                {product.images && product.images.length > 0 ? (
                                                    <img 
                                                        src={product.images[0]?.url || product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
                                                        alt={product.title} 
                                                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl rounded-lg"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Image+Error'; }}
                                                    />
                                                ) : (
                                                    <svg className="w-12 h-12 text-[#958EA0] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                    {product.price?.currency === 'INR' ? '₹' : product.price?.currency} {product.price?.amount}
                                                </div>
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-black/20">
                                                <h3 className="font-semibold text-white mb-1.5 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                                    {product.title}
                                                </h3>
                                                <p className="text-[#958EA0] text-sm line-clamp-2 mb-4 flex-1">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5 text-xs text-[#958EA0]">
                                                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                                                    <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                                        Edit Product
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{__html: `
                .scrollbar-thin::-webkit-scrollbar { width: 5px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .scrollbar-thin:hover::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
            `}} />
        </div>
    );
};

export default Dashboard;