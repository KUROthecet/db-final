
import axiosClient from '../../../api/axiosClient';
import { Order } from '../../../types';

const getLocalISODate = () => {
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
}

export const orderService = {
  createOrder: async (orderData: any): Promise<any> => {
    const payload = {
        ...orderData,
        id: `ORD-${Date.now()}`,
        orderDate: getLocalISODate(),
        items: orderData.items.map((i: any) => ({
            id: i.id, 
            qty: i.quantity 
        }))
    };
    return await axiosClient.post('/api/orders', payload);
  },

  getMyHistory: async (userId: number): Promise<Order[]> => {
    const res: any = await axiosClient.get(`/api/orders/history/${userId}`);
    return res.map((o: any) => ({
        id: o.id,
        date: o.orderdate,
        totalAmount: Number(o.total_amount),
        status: o.status,
        items: o.items || [] 
    }));
  },

  getOrderById: async (orderId: string): Promise<Order> => {
      const res: any = await axiosClient.get(`/api/orders/track/${orderId}`);
      return {
          id: res.id,
          date: res.orderdate,
          totalAmount: Number(res.total_amount),
          status: res.status,
          shippingAddress: res.receive_address,
          phone: res.receive_phone,
          customerName: res.receiver, 
          items: res.items?.map((item: any) => ({
              productName: item.productName,
              quantity: item.quantity,
              price: Number(item.price),
              image: item.image 
          })) || [] 
      } as Order;
  },

  getAllOrders: async (date: string, filterType: string = 'order_date'): Promise<Order[]> => {
    const res: any = await axiosClient.post('/employee/order', { date, filterType });
    return res;
  },

  updateStatus: async (orderId: string, status: string): Promise<any> => {
      return await axiosClient.post('/employee/order/update-status', { orderId, status });
  }
};
