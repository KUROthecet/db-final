import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { Role } from '../types';
import { ShoppingBag, LogOut, User as UserIcon, UserPlus, Search, Menu as MenuIcon, X, ChevronRight, Minus, Plus, Trash2, ChevronDown, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  
  // State mới để điều khiển thanh Search mở rộng
  const [isSearchExpandOpen, setIsSearchExpandOpen] = useState(false);
  
  // State mới cho User Avatar Dropdown
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if user is Admin or Employee (Staff)
  const isAdminOrStaff = currentUser?.role === Role.MANAGER || currentUser?.role === Role.EMPLOYEE;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProductSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (productSearch.trim()) {
      navigate(`/menu?search=${encodeURIComponent(productSearch.trim())}`);
      setProductSearch('');
      setIsSearchExpandOpen(false); // Đóng thanh search sau khi tìm
    }
  };

  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderSearch.trim()) {
      navigate(`/track/${encodeURIComponent(orderSearch.trim())}`);
      setOrderSearch('');
      setIsSearchExpandOpen(false); // Đóng thanh search sau khi tìm
    }
  };

  const isActive = (path: string) => location.pathname === path 
    ? 'text-white font-bold border-b-2 border-white' 
    : 'text-white/80 hover:text-white transition-colors';

  const isMenuActive = location.pathname === '/menu';

  return (
    <header className="w-full flex flex-col z-50 sticky top-0">
      {/* PHẦN 1: MAIN HEADER (Logo & Actions) */}
      <div className="bg-tlj-cream py-4 border-b border-tlj-green/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-12 items-center">
            
            {/* LOGO (3 cột) */}
            <div className="col-span-4 md:col-span-3 flex justify-start items-center gap-3">
              <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105 duration-300">
                <img
                  src="/logo2.png" 
                  alt="Pane e Amore Logo"
                  className="h-20 md:h-24 w-auto object-contain contrast-110"
                />
              </Link>
              {/* Admin/Staff Portal Badge */}
              {isAdminOrStaff && (
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-[9px] text-tlj-green/60 uppercase tracking-[0.15em] font-bold">
                    {currentUser?.role === Role.MANAGER ? 'Admin' : 'Staff'}
                  </span>
                  <span className="text-xs text-tlj-green font-bold uppercase tracking-wider">
                    Portal
                  </span>
                </div>
              )}
            </div>

            {/* ACTIONS (9 cột) - Chứa Search Toggle, User, Cart */}
            <div className="col-span-8 md:col-span-9 flex items-center justify-end gap-4 md:gap-8 whitespace-nowrap">
              
              {/* NÚT SEARCH TOGGLE (Chỉ hiển thị cho Customer hoặc chưa đăng nhập) */}
              {!isAdminOrStaff && (
                <button 
                  onClick={() => setIsSearchExpandOpen(!isSearchExpandOpen)}
                  className={`flex items-center gap-2 p-2.5 rounded-full transition-all duration-300 ${isSearchExpandOpen ? 'bg-tlj-green text-white shadow-md' : 'text-tlj-green hover:bg-tlj-green/5'}`}
                >
                  {isSearchExpandOpen ? <X size={22} /> : <Search size={22} />}
                  <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">Search</span>
                </button>
              )}

              {/* USER SECTION - PHẦN THAY ĐỔI CHÍNH */}
              {!currentUser ? (
                <div className="hidden sm:flex items-center gap-6">
                  <Link to="/login" className="flex items-center gap-2 text-base font-semibold text-tlj-charcoal hover:text-tlj-green transition-all">
                    <UserIcon size={18} /> Sign in
                  </Link>
                  <Link to="/signup" className="flex items-center gap-2 text-base font-semibold text-tlj-charcoal hover:text-tlj-green transition-all">
                    <UserPlus size={18} /> Sign up
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  {/* Avatar Circle Button */}
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-tlj-green/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-tlj-green text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-105 transition-transform overflow-hidden">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none">
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Account</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-tlj-green">
                          {currentUser?.fullName ? currentUser.fullName.split(' ').pop() : 'User'}
                        </span>
                        <ChevronDown size={14} className={`text-tlj-green transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      {/* Overlay để click ra ngoài thì đóng menu */}
                      <div className="fixed inset-0 z-[60]" onClick={() => setUserMenuOpen(false)}></div>
                      
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[70]">
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Logged in as</p>
                          <p className="text-sm font-bold text-tlj-green truncate">{currentUser?.fullName || 'User'}</p>
                          <p className="text-[9px] text-tlj-charcoal/50 italic">{currentUser?.role}</p>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green transition-all"
                        >
                          <UserIcon size={16} /> My Profile
                        </Link>

                        {/* Link tới đơn hàng nếu là khách hàng */}
                        {currentUser?.role === Role.CUSTOMER && (
                          <Link 
                            to="/history" 
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green transition-all"
                          >
                            <ShoppingBag size={16} /> My Orders
                          </Link>
                        )}

                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button 
                            onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all font-semibold"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* GIỎ HÀNG (Chỉ hiển thị cho Customer hoặc chưa đăng nhập) */}
              {(currentUser?.role === Role.CUSTOMER || !currentUser) && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 bg-white rounded-full border border-tlj-green/20 text-tlj-green hover:bg-tlj-green hover:text-white transition-all shadow-sm group flex-shrink-0"
                >
                  <ShoppingBag size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-tlj-cream">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN 2: SEARCH OVERLAY (Chỉ hiển thị cho Customer hoặc chưa đăng nhập) */}
      {!isAdminOrStaff && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-white border-b border-tlj-green/10 shadow-inner ${isSearchExpandOpen ? 'max-h-60 opacity-100 py-8' : 'max-h-0 opacity-0 py-0'}`}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
              
              {/* Form Tìm bánh */}
              <div className="w-full space-y-2">
                <label className="text-[11px] font-bold text-tlj-green/60 uppercase tracking-widest ml-4">Find what you want</label>
                <form onSubmit={handleProductSearch} className="relative group">
                  <input 
                    type="text" 
                    placeholder="Ex: Tiramisu, Croissant..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-tlj-cream/30 border border-tlj-green/10 rounded-full py-3 pl-6 pr-12 text-base focus:outline-none focus:border-tlj-green transition-all"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-tlj-green/40 group-hover:text-tlj-green">
                    <Search size={20} />
                  </button>
                </form>
              </div>

              {/* Vạch kẻ chia dọc trên desktop */}
              <div className="hidden md:block w-px h-16 bg-tlj-green/10 self-center"></div>

              {/* Form Tìm đơn hàng */}
              <div className="w-full space-y-2">
                <label className="text-[11px] font-bold text-tlj-green/60 uppercase tracking-widest ml-4">Track Order ID</label>
                <form onSubmit={handleOrderSearch} className="relative group">
                  <input 
                    type="text" 
                    placeholder="Ex: ORD-17683..." 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-tlj-cream/30 border border-tlj-green/10 rounded-full py-3 pl-6 pr-12 text-base focus:outline-none focus:border-tlj-green transition-all"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-tlj-green/40 group-hover:text-tlj-green">
                    <Search size={20} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PHẦN 3: NAVIGATION MENU */}
      <nav className={`${isAdminOrStaff ? 'bg-gradient-to-r from-tlj-charcoal to-tlj-green' : 'bg-tlj-green'} text-white shadow-md transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between md:justify-center">
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon size={28} />
          </button>

          <div className="hidden md:flex items-center space-x-16">
            {/* Conditional Navigation Links - Hide for Admin/Staff */}
            {!isAdminOrStaff && (
              <>
                <Link to="/" className={`uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isActive('/')}`}>
                  Home
                </Link>
                
                <div className="relative group">
                  <Link to="/menu" className={`flex items-center gap-2 uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isMenuActive ? 'text-white border-b-2 border-white' : 'text-white/80 hover:text-white'}`}>
                    Menu <ChevronDown size={16} className={`transition-transform duration-300 group-hover:rotate-180`} />
                  </Link>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col p-2">
                      {['Bread', 'Cakes', 'Coffee', 'Milk'].map((cat) => (
                        <Link 
                          key={cat}
                          to={`/menu?category=${cat}`} 
                          className="px-6 py-3 text-sm text-tlj-charcoal hover:bg-tlj-cream hover:text-tlj-green rounded-lg transition-all font-serif"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link to="/about" className={`uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isActive('/about')}`}>
                  About Us
                </Link>

                <Link to="/contact" className={`uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isActive('/contact')}`}>
                  Contact
                </Link>
              </>
            )}
            
            {/* Role-specific navigation */}
            {currentUser?.role === Role.CUSTOMER && (
              <Link to="/history" className={`uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isActive('/history')}`}>Orders</Link>
            )}
            {currentUser?.role === Role.EMPLOYEE && (
              <Link to="/employee" className={`uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isActive('/employee')}`}>Workspace</Link>
            )}
            {currentUser?.role === Role.MANAGER && (
              <Link to="/admin" className={`uppercase text-sm font-bold tracking-[0.2em] transition-all duration-300 hover:scale-105 ${isActive('/admin')}`}>Admin Dashboard</Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-[100] ${isAdminOrStaff ? 'bg-tlj-charcoal/95' : 'bg-tlj-green/95'} backdrop-blur-md flex flex-col justify-center items-center text-white transition-opacity duration-300`}>
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-white/80 hover:text-white">
            <X size={32} />
          </button>
          <nav className="flex flex-col space-y-6 text-center w-full px-8">
            {/* Conditional Mobile Menu - Hide customer links for Admin/Staff */}
            {!isAdminOrStaff && (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Home</Link>
                <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Menu</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">About Us</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Contact</Link>
              </>
            )}
            
            {/* Role-specific mobile navigation */}
            {currentUser?.role === Role.CUSTOMER && (
              <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Orders</Link>
            )}
            {currentUser?.role === Role.EMPLOYEE && (
              <Link to="/employee" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Workspace</Link>
            )}
            {currentUser?.role === Role.MANAGER && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif border-b border-white/20 pb-4 w-full block">Admin Dashboard</Link>
            )}
            
            {currentUser && (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif border-b border-white/20 pb-4 w-full block">My Profile</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-xl font-sans uppercase tracking-widest mt-8 border px-8 py-2 border-white/30">Logout</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

// CART DRAWER & FOOTER & LAYOUT GIỮ NGUYÊN NHƯ BẢN GỐC CỦA BẠN
const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
      setIsCartOpen(false);
      if (!currentUser) {
          navigate('/login', { state: { from: { pathname: '/checkout' } } });
      } else {
          navigate('/checkout');
      }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-tlj-cream shadow-2xl flex flex-col transform transition-transform animate-slide-in">
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
            <h2 className="text-lg font-serif font-bold text-tlj-green">Your Basket ({cart.length})</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-tlj-charcoal">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Your basket is empty</p>
                <button onClick={() => setIsCartOpen(false)} className="text-tlj-green font-semibold hover:underline">Continue Shopping</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-tlj-charcoal font-medium leading-tight mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-tlj-green font-bold text-sm">
                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-gray-200 rounded-full bg-white">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-tlj-green"><Minus size={14} /></button>
                          <span className="text-xs w-6 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-tlj-green"><Plus size={14} /></button>
                       </div>
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="text-2xl font-serif font-bold text-tlj-charcoal">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-tlj-green text-white font-sans uppercase tracking-widest text-sm font-semibold hover:bg-tlj-charcoal transition-colors flex items-center justify-center gap-2"
              >
                Checkout <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const Footer = () => (
  <footer className="bg-tlj-green text-white pt-16 pb-8 border-t border-white/10 mt-20">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 items-start">
        <div className="space-y-6">
           <Link to="/" className="inline-block group">
               <img src="/logo.png" alt="Logo" className="h-36 w-auto object-contain brightness-0 invert mb-2 transition-transform group-hover:scale-105" />
               <p className="text-xs tracking-[0.3em] uppercase text-tlj-cream font-bold leading-tight">Artisan Baking <br/> Since 2009</p>
           </Link>
           <div className="flex gap-3">
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-tlj-green transition-all"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-tlj-green transition-all"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-tlj-green transition-all"><Linkedin size={20} /></a>
           </div>
        </div>
        <div>
          <h4 className="font-serif text-2xl font-bold text-tlj-cream uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">Bakery</h4>
          <ul className="space-y-3 text-lg text-white/80 font-light">
             <li><Link to="/menu?category=Bread" className="hover:text-white hover:pl-1 transition-all inline-block">Bread</Link></li>
             <li><Link to="/menu?category=Cakes" className="hover:text-white hover:pl-1 transition-all inline-block">Cakes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-2xl font-bold text-tlj-cream uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">Drinks</h4>
          <ul className="space-y-3 text-lg text-white/80 font-light">
             <li><Link to="/menu?category=Coffee" className="hover:text-white hover:pl-1 transition-all inline-block">Coffee</Link></li>
             <li><Link to="/menu?category=Milk" className="hover:text-white hover:pl-1 transition-all inline-block">Milk</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-2xl font-bold text-tlj-cream uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">Explore</h4>
          <ul className="space-y-3 text-lg text-white/80 font-light">
             <li><Link to="/" className="hover:text-white transition-all">Home</Link></li>
             <li><Link to="/about" className="hover:text-white transition-all">Our Story</Link></li>
             <li><Link to="/contact" className="hover:text-white transition-all">Contact</Link></li>
             <li><Link to="/faq" className="hover:text-white transition-all">FAQ</Link></li>
          </ul>
        </div>
        <div className="space-y-0">
          <h4 className="font-serif text-2xl font-bold text-tlj-cream uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">Visit Us</h4>
          <div className="space-y-0 text-base text-white/70 font-light leading-relaxed">
             <p className="hover:text-white transition-colors">ADDRESS: <br/> No 1 Dai Co Viet, <br/> Hai Ba Trung, Ha Noi</p>
             <p className="text-white font-small text-lg pt-2 border-t border-white/5">+84 123 456 789</p>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-white/40 uppercase tracking-[0.2em] font-medium">
        <p>© 2026 Pane e Amore Bakery. Artisan Excellence.</p>
        <div className="flex gap-8">
          <Link to="/policy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = ({ children, hideFooter = false }: React.PropsWithChildren<{ hideFooter?: boolean }>) => (
  <div className="min-h-screen flex flex-col bg-tlj-cream">
    <Navbar />
    <CartDrawer />
    <main className="flex-grow">
      {children}
    </main>
    {!hideFooter && <Footer />}
  </div>
);

export const AuthLayout = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="min-h-screen flex flex-col bg-tlj-cream">
    <main className="flex-grow">
      {children}
    </main>
  </div>
);
