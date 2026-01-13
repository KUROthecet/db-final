
import axiosClient from '../../../api/axiosClient';
import { Order, Product } from '../../../types';

export const employeeService = {
  getAllOrders: async (date: string, filterType: 'order_date' | 'receive_date' = 'order_date'): Promise<Order[]> => {
    const res: any = await axiosClient.post('/employee/order', { date, filterType });
    
    return res.map((o: any) => ({
      id: o.id,
      customerName: o.fullname || o.receiver || 'Guest',
      phone: o.phone || o.receive_phone,
      date: o.ordertime || o.orderdate, 
      totalAmount: Number(o.total_amount),
      status: o.status,
      shippingAddress: o.receive_address,
      items: o.items ? o.items.map((i: any) => ({
          productName: i.productName,
          quantity: i.quantity,
          price: Number(i.price)
      })) : [],
      note: o.note
    }));
  },

  getOrderDetail: async (orderId: string): Promise<any[]> => {
    return await axiosClient.post('/employee/order/detail', { orderId });
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    return await axiosClient.post('/employee/order/update-status', { orderId, status });
  },

  getStock: async (): Promise<Product[]> => {
    return await axiosClient.get('/employee/stock');
  }
};
