
import axiosClient from '../../../api/axiosClient';
import { Product } from '../../../types';

export const productService = {
  // Lấy Menu cho khách hàng
  getMenu: async (): Promise<Product[]> => {
    const res: any = await axiosClient.get('/menu');
    return res.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category || 'General',
        price: Number(item.price),
        description: item.description || '',
        image: item.images || item.image || 'https://via.placeholder.com/150',
        stock: item.stock || 0,
        status: item.status || 'active'
    }));
  },

  getProductById: async (id: string | number): Promise<Product> => {
    const res: any = await axiosClient.get(`/menu/${id}`); 
    return {
        id: res.id,
        name: res.name,
        category: res.category || 'General',
        price: Number(res.price),
        description: res.description || '',
        image: res.images || res.image,
        stock: res.stock,
        status: res.status,
        ingredients: res.ingredients,
        nutritionInfo: res.nutrition_info
    };
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const res: any = await axiosClient.get(`/menu/search?q=${encodeURIComponent(query)}`);
    return res.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category || 'General',
        price: Number(item.price),
        description: item.description || '',
        image: item.images || item.image || 'https://via.placeholder.com/150',
        stock: item.stock || 0,
        status: item.status || 'active'
    }));
  },

  getAllStock: async (): Promise<Product[]> => {
     const res: any = await axiosClient.get('/manager/products');
     return res;
  },

  addProduct: async (data: any): Promise<any> => {
    return await axiosClient.post('/manager/products/add', data);
  },
  
  updateProduct: async (data: any): Promise<any> => {
      return await axiosClient.put('/manager/products/edit', data);
  },

  deleteProduct: async (id: number): Promise<any> => {
      return await axiosClient.delete(`/manager/products/delete/${id}`);
  }
};
