
import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { OrderStatus, Order, Product } from '../types';
import { employeeService } from '../features/employee/services/employeeService';
import { orderService } from '../features/orders/services/orderService';
import { Check, Truck, Package, X, Search, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, Trash2, CreditCard } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        const dateStr = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
        const data = await employeeService.getAllOrders(dateStr);
        setOrders(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
      try {
          await employeeService.updateOrderStatus(orderId, status);
          fetchOrders();
      } catch (e: any) {
          alert(`Failed to update status: ${e.response?.data?.error || e.message}`);
      }
  }

  const toggleExpand = (id: string) => {
      setExpandedOrder(expandedOrder === id ? null : id);
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getNextAction = (order: Order) => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, OrderStatus.CONFIRMED); }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1 shadow-sm"
          >
            <Check size={14} /> Confirm
          </button>
        );
      case OrderStatus.CONFIRMED:
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, OrderStatus.DELIVERING); }}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs flex items-center gap-1 shadow-sm"
          >
            <Truck size={14} /> Ship
          </button>
        );
      case OrderStatus.DELIVERING:
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, OrderStatus.COMPLETED); }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs flex items-center gap-1 shadow-sm"
          >
            <Package size={14} /> Complete
          </button>
        );
      default:
        return null;
    }
  };

  if(loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <h2 className="font-bold text-gray-700 flex items-center gap-2">Today's Orders <span className="text-xs bg-tlj-green text-white px-2 py-0.5 rounded-full">{orders.length}</span></h2>
             <button onClick={fetchOrders} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-tlj-green"><RefreshCw size={18} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items Summary</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <React.Fragment key={order.id}>
                <tr className="hover:bg-tlj-cream/20 cursor-pointer transition-colors" onClick={() => toggleExpand(order.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-bold text-gray-800">{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <span className="truncate max-w-[200px]">
                            {order.items && order.items.length > 0 
                                ? order.items.slice(0, 2).map(i => `${i.quantity}x ${i.productName}`).join(', ') 
                                : 'No items'}
                        </span>
                        {order.items && order.items.length > 2 && <span className="text-xs text-gray-400">+{order.items.length - 2} more</span>}
                        {expandedOrder === order.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-tlj-green">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider
                      ${order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      {getNextAction(order)}
                      {order.status === OrderStatus.PENDING && (
                         <button 
                            onClick={() => handleStatusUpdate(order.id, OrderStatus.CANCELLED)}
                            className="px-2 py-1 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors"
                            title="Cancel Order"
                          >
                            <X size={16} />
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                    <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Delivery Details</h4>
                                    <p className="text-gray-600"><span className="font-medium">Address:</span> {order.shippingAddress}</p>
                                    <p className="text-gray-600"><span className="font-medium">Note:</span> {order.note || 'None'}</p>
                                    <p className="text-gray-600"><span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Full Item List</h4>
                                    <ul className="space-y-1">
                                        {order.items?.map((item, idx) => (
                                            <li key={idx} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                                                <span>{item.quantity}x {item.productName}</span>
                                                <span className="font-mono text-gray-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
                </React.Fragment>
              ))}
              {sortedOrders.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No orders found for today.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  )
}

const StockManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        employeeService.getStock().then(setProducts).catch(console.error);
    }, []);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <Search className="text-gray-400" size={20} />
                <input 
                type="text" 
                placeholder="Search products..." 
                className="flex-1 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Level</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-tlj-cream/20 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded object-cover bg-gray-100" alt="" />
                                        <span className="font-bold text-gray-900">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full w-12 justify-center
                                            ${p.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {p.stock}
                                        </span>
                                        {p.stock < 10 && <AlertCircle size={16} className="text-red-500" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const PosSystem = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        employeeService.getStock().then(setProducts).catch(console.error);
    }, []);

    const addToCart = (p: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === p.id);
            if(existing) {
                if (existing.qty >= p.stock) return prev;
                return prev.map(item => item.product.id === p.id ? {...item, qty: item.qty + 1} : item);
            }
            return [...prev, {product: p, qty: 1}];
        })
    }

    const updateQty = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if(item.product.id === id) {
                const newQty = Math.max(0, item.qty + delta);
                if (newQty > item.product.stock) return item;
                return {...item, qty: newQty};
            }
            return item;
        }).filter(item => item.qty > 0));
    }

    const handleCreateOrder = async () => {
        if(cart.length === 0) return;
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
        
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const orderPayload = {
            cus_id: null, 
            items: cart.map(i => ({id: i.product.id, quantity: i.qty})),
            prices: { total, subtotal: total, ship: 0 },
            payment: 'cash',
            time: { slot: formattedTime, date: now.toISOString().split('T')[0] },
            address: 'In-store Pickup',
            customer: { note: 'Walk-in Customer' },
            receiver: { name: 'Guest', phone: '' },
            employee_id: currentUser?.id, 
            status: 'pending' 
        };

        try {
            await orderService.createOrder(orderPayload);
            alert("Order created successfully!");
            setCart([]);
            employeeService.getStock().then(setProducts).catch(console.error);
        } catch (e) {
            alert("Failed to create order");
        }
    }

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm)
    );
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <Search className="text-gray-400" size={20} />
                        <input 
                            className="bg-transparent outline-none flex-1" 
                            placeholder="Scan SKU or Search Product..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(p => (
                            <button 
                                key={p.id} 
                                onClick={() => addToCart(p)}
                                disabled={p.stock <= 0}
                                className={`text-left p-3 rounded-xl border transition-all flex flex-col h-full ${p.stock > 0 ? 'border-gray-200 hover:border-tlj-green hover:shadow-md bg-white' : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'}`}
                            >
                                <div className="h-24 bg-gray-100 rounded-lg mb-2 overflow-hidden w-full">
                                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-auto">{p.name}</h4>
                                <div className="flex justify-between items-center mt-2 w-full">
                                    <span className="font-mono text-xs text-tlj-green font-bold">{new Intl.NumberFormat('vi-VN').format(p.price)}</span>
                                    <span className={`text-[10px] px-1.5 rounded ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.stock}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2"><ShoppingCart size={18}/> Current Order</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <ShoppingCart size={48} className="mb-2" />
                            <p>Select items to add</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.product.id} className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg">
                                <div className="w-10 h-10 bg-white rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                    <img src={item.product.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{item.product.name}</p>
                                    <p className="text-xs text-tlj-green font-bold">{new Intl.NumberFormat('vi-VN').format(item.product.price)}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-white rounded border border-gray-200">
                                    <button onClick={() => updateQty(item.product.id, -1)} className="p-1 hover:bg-gray-100"><Minus size={12}/></button>
                                    <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.product.id, 1)} className="p-1 hover:bg-gray-100"><Plus size={12}/></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-2xl font-bold text-tlj-green">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                    </div>
                    <button 
                        onClick={handleCreateOrder}
                        disabled={cart.length === 0}
                        className="w-full py-3 bg-tlj-green text-white font-bold rounded-lg hover:bg-tlj-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
                    >
                        <CreditCard size={18} /> Create Order
                    </button>
                </div>
            </div>
        </div>
    )
}

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'pos'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif font-bold text-tlj-charcoal">Employee Workspace</h1>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-tlj-green text-white shadow-sm' : 'text-gray-500 hover:text-tlj-green'}`}
            >
                Orders
            </button>
            <button 
                onClick={() => setActiveTab('pos')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'pos' ? 'bg-tlj-green text-white shadow-sm' : 'text-gray-500 hover:text-tlj-green'}`}
            >
                POS
            </button>
            <button 
                onClick={() => setActiveTab('stock')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'stock' ? 'bg-tlj-green text-white shadow-sm' : 'text-gray-500 hover:text-tlj-green'}`}
            >
                Stock
            </button>
        </div>
      </div>
      
      {activeTab === 'orders' && <OrderManagement />}
      {activeTab === 'pos' && <PosSystem />}
      {activeTab === 'stock' && <StockManagement />}
    </div>
  );
};

export default EmployeeDashboard;
