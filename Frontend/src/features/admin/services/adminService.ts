
import axiosClient from '../../../api/axiosClient';
import { User, Product, RevenueReport, WeeklyRevenue } from '../../../types';

export const adminService = {
  getDailyReport: async (date: string): Promise<RevenueReport> => {
    return await axiosClient.get(`/manager/revenue?date=${date}`);
  },

  getWeeklyReport: async (startOfWeek: string, date: string): Promise<WeeklyRevenue[]> => {
    return await axiosClient.get(`/manager/revenue/weekly?startOfWeek=${startOfWeek}&date=${date}`);
  },

  getEmployees: async (): Promise<User[]> => {
    const res: any = await axiosClient.get('/manager/employees');
    return res.map((e: any) => ({
      ...e,
      fullName: e.fullname, 
    }));
  },

  addEmployee: async (data: any): Promise<void> => {
    return await axiosClient.post('/manager/employees/add', {
      loginEmail: data.loginEmail,
      phoneNumber: data.phoneNumber,
      password: data.password,
      fullName: data.fullName,
      gender: data.gender,
      avatar: data.avatar,
      address: data.address,
      department: data.department,
      empId: data.empId,
      dob: data.dob || ''
    });
  },

  updateEmployee: async (data: any): Promise<void> => {
    return await axiosClient.put('/manager/employees/edit', {
      department: data.department,
      avatar: data.avatar,
      empId: data.empId
    });
  },

  deleteEmployee: async (id: number): Promise<void> => {
    return await axiosClient.delete(`/manager/employees/delete/${id}`);
  },

  getProducts: async (): Promise<Product[]> => {
    const res: any = await axiosClient.get('/manager/products');
    return res;
  },

  addProduct: async (data: any): Promise<void> => {
    return await axiosClient.post('/manager/products/add', {
      productName: data.productName,
      category: data.category,
      price: data.price,
      image: data.image,
      sku: data.sku, 
      count: data.count, 
      description: data.description,
      status: data.status,
      slug: data.slug || data.productName.toLowerCase().replace(/ /g, '-')
    });
  },

  updateProduct: async (data: any): Promise<void> => {
    return await axiosClient.put('/manager/products/edit', {
      productName: data.productName,
      price: data.price,
      description: data.description,
      count: data.count, 
      status: data.status,
      image: data.image,
      sku: data.sku 
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    return await axiosClient.delete(`/manager/products/delete/${id}`);
  },
  
  uploadAvatar: async (file: File): Promise<{url: string}> => {
    const formData = new FormData();
    formData.append('image', file);
    return await axiosClient.post('/manager/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
