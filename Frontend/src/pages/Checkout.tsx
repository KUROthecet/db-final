
import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Banknote, QrCode } from 'lucide-react';

const CITIES = ["Ha Noi", "Ho Chi Minh City", "Da Nang"];
const DISTRICTS: Record<string, string[]> = {
  "Ha Noi": ["Ba Dinh", "Hai Ba Trung", "Cau Giay", "Dong Da"],
  "Ho Chi Minh City": ["Quan 1", "Quan 3", "Binh Thanh"],
  "Da Nang": ["Hai Chau", "Son Tra", "Thanh Khe"],
};

const Checkout = () => {
  const { cart, placeOrder } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [note, setNote] = useState('');
  
  const [city, setCity] = useState("Ha Noi");
  const [district, setDistrict] = useState("Hai Ba Trung");
  const [street, setStreet] = useState("");
  const [payment, setPayment] = useState("cod"); 
  const [showQR, setShowQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payment === 'bank' && !showQR) {
        setShowQR(true);
        return;
    }

    setIsSubmitting(true);
    const fullAddress = `${street}, ${district}, ${city}`;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    const orderPayload = {
        cus_id: currentUser?.id,
        items: cart, 
        prices: { total, subtotal, ship: shippingFee },
        payment,
        time: { 
            slot: formattedTime, 
            date: now.toISOString().split('T')[0] 
        },
        address: fullAddress,
        customer: { note },
        receiver: {
            name: customerName,
            phone: phone
        },
        status: 'pending'
    };
    
    try {
        await placeOrder(orderPayload);
        navigate('/order-success');
    } catch (error) {
        console.error(error);
        alert("Failed to place order. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return <div className="text-center py-20">Your cart is empty. <Link to="/menu" className="text-tlj-green underline">Go shopping</Link></div>;

  return (
    <div className="min-h-screen bg-tlj-cream py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
           <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-tlj-green"><ArrowLeft size={16}/> Back to Cart</Link>
           <h1 className="text-3xl font-serif font-bold text-tlj-charcoal mt-2">Order Confirmation</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-tlj-green">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400">Receiver Name</label>
                            <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2 border border-gray-200 rounded outline-none focus:border-tlj-green" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400">Phone</label>
                            <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border border-gray-200 rounded outline-none focus:border-tlj-green" />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400">Note</label>
                            <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 border border-gray-200 rounded outline-none focus:border-tlj-green" placeholder="Ex: Less sugar, deliver to lobby..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-tlj-green">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400">City</label>
                            <select value={city} onChange={e => setCity(e.target.value)} className="w-full p-2 border border-gray-200 rounded outline-none focus:border-tlj-green bg-white">
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400">District</label>
                            <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full p-2 border border-gray-200 rounded outline-none focus:border-tlj-green bg-white">
                                {(DISTRICTS[city] || []).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400">Street / Building</label>
                            <input required type="text" value={street} onChange={e => setStreet(e.target.value)} className="w-full p-2 border border-gray-200 rounded outline-none focus:border-tlj-green" placeholder="Ex: 1 Dai Co Viet" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-tlj-green">Payment Method</h3>
                    <div className="flex gap-4">
                        <label className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${payment === 'cod' ? 'border-tlj-green bg-tlj-cream/20' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="hidden" />
                            <div className="p-2 bg-gray-100 rounded-full"><Banknote size={20} className="text-gray-600" /></div>
                            <span className="font-bold text-sm text-gray-700">Cash on Delivery</span>
                        </label>
                         <label className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${payment === 'bank' ? 'border-tlj-green bg-tlj-cream/20' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="payment" value="bank" checked={payment === 'bank'} onChange={() => setPayment('bank')} className="hidden" />
                            <div className="p-2 bg-gray-100 rounded-full"><QrCode size={20} className="text-gray-600" /></div>
                            <span className="font-bold text-sm text-gray-700">Bank Transfer (QR)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                    <h3 className="font-bold text-lg mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <img src={item.image} alt="" className="w-12 h-12 rounded object-cover bg-gray-50" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping</span>
                            <span>{shippingFee === 0 ? 'Free' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-tlj-charcoal mt-2 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span className="text-tlj-green">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-tlj-green text-white font-bold rounded-xl hover:bg-tlj-charcoal transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                    >
                        {isSubmitting ? 'Processing...' : (payment === 'bank' && !showQR ? 'Proceed to Payment' : 'Confirm Order')}
                    </button>
                </div>
            </div>
        </form>
      </div>
      
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative">
                 <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><ArrowLeft size={20}/></button>
                 <h3 className="text-xl font-bold mb-2">Scan to Pay</h3>
                 <p className="text-gray-500 text-sm mb-6">Total: <span className="text-tlj-green font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span></p>
                 
                 <div className="bg-gray-100 p-4 rounded-xl mb-6 mx-auto w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode size={100} className="text-gray-400" />
                 </div>
                 
                 <p className="text-xs text-gray-400 mb-6">Please keep the transaction screen open until confirmation.</p>
                 <button onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full py-3 bg-tlj-green text-white font-bold rounded-xl hover:bg-tlj-charcoal">
                    {isSubmitting ? 'Processing...' : 'I have paid'}
                 </button>
             </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
