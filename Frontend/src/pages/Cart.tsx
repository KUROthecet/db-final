import React from 'react';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleProceed = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-tlj-cream">
        <div className="bg-white p-6 rounded-full mb-6 shadow-sm">
          <ShoppingBag size={48} className="text-tlj-green" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-tlj-charcoal mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any sweet treats yet.</p>
        <Link to="/menu" className="px-8 py-3 bg-tlj-green text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-tlj-charcoal transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-tlj-charcoal">Shopping Cart ({cart.length})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center border border-gray-100">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />
                <div className="flex-grow">
                  <h3 className="font-serif font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                  <p className="text-tlj-green font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50 text-gray-500">
                        <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50 text-gray-500">
                        <Plus size={16} />
                    </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold mb-6 font-serif">Order Summary</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Shipping</span>
                  <span className="font-medium">{shippingFee === 0 ? 'Free' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                </div>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-lg text-tlj-charcoal">Total</span>
                <span className="font-bold text-xl text-tlj-green">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
              </div>
              <button 
                onClick={handleProceed}
                className="w-full py-4 bg-tlj-green text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-tlj-charcoal transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18}/>
              </button>
              <Link to="/menu" className="block text-center mt-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-tlj-green">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Cart;