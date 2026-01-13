
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../features/orders/services/orderService';
import { Check, Clock, Package, Truck, ArrowLeft, MapPin } from 'lucide-react';
import { OrderStatus, Order } from '../types';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchOrder = async () => {
          if(!id) return;
          try {
              const data = await orderService.getOrderById(id);
              setOrder(data);
          } catch (e) {
              setError("Order not found or access denied.");
          } finally {
              setLoading(false);
          }
      };
      fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;

  if (error || !order) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-serif font-bold mb-4">Order Not Found</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link to="/history" className="text-tlj-green underline">Return to history</Link>
        </div>
    );
  }

  const steps = [
    { status: OrderStatus.PENDING, label: 'Order Placed', icon: Clock, desc: 'We have received your order.' },
    { status: OrderStatus.CONFIRMED, label: 'Confirmed', icon: Check, desc: 'Kitchen is preparing your treats.' },
    { status: OrderStatus.DELIVERING, label: 'On Delivery', icon: Truck, desc: 'Shipper is on the way.' },
    { status: OrderStatus.COMPLETED, label: 'Delivered', icon: Package, desc: 'Enjoy your meal!' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="min-h-screen bg-tlj-cream py-12 px-4">
       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-tlj-green p-6 text-white flex justify-between items-start">
             <div>
                <Link to="/history" className="text-white/70 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft size={14}/> Back</Link>
                <h1 className="text-2xl font-serif font-bold">Order #{order.id}</h1>
                <p className="text-white/80 text-sm opacity-80">Placed on {new Date(order.date).toLocaleDateString()}</p>
             </div>
             <div className="text-right">
                <p className="text-xs uppercase tracking-widest opacity-70">Total Amount</p>
                <p className="text-xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</p>
             </div>
          </div>

          <div className="p-8">
             {isCancelled ? (
                 <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border border-red-100">
                    This order has been cancelled.
                 </div>
             ) : (
                 <div className="relative">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100"></div>

                    <div className="space-y-8">
                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            
                            return (
                                <div key={step.label} className="relative flex items-start gap-6 group">
                                    <div className={`
                                        z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                        ${isCompleted ? 'bg-tlj-green border-tlj-cream text-white' : 'bg-white border-gray-100 text-gray-300'}
                                    `}>
                                        <step.icon size={20} />
                                    </div>
                                    <div className={`pt-2 transition-all duration-500 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                        <h3 className={`font-bold text-lg ${isCurrent ? 'text-tlj-green' : 'text-gray-800'}`}>{step.label}</h3>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                        {isCurrent && <span className="inline-block mt-2 text-[10px] bg-tlj-green/10 text-tlj-green px-2 py-0.5 rounded font-bold uppercase tracking-widest">Happening Now</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 </div>
             )}
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-tlj-green"/> Delivery Address
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress}</p>
                <p className="text-sm text-gray-600 mt-1">Phone: <span className="font-medium text-gray-900">{order.phone}</span></p>
             </div>
             {order.items && order.items.length > 0 && (
                 <div>
                    <h4 className="font-bold text-gray-900 mb-4">Items</h4>
                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.productName}</span>
                                <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                            </div>
                        ))}
                    </div>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default OrderTracking;
