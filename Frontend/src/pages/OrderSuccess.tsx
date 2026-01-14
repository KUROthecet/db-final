
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-tlj-cream px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-tlj-green/10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-tlj-charcoal mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your order has been received and is being prepared with love.
        </p>

        <div className="space-y-3">
          <Link 
            to="/history" 
            className="flex items-center justify-center gap-2 w-full py-3 bg-tlj-green text-white rounded-xl font-bold hover:bg-tlj-charcoal transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Package size={18} /> Track Your Order
          </Link>
          
          <Link 
            to="/menu" 
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:border-tlj-green hover:text-tlj-green transition-colors"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
