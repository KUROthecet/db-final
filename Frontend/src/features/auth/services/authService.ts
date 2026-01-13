
import axiosClient from '../../../api/axiosClient';
import { Role, User, AuthResponse } from '../../../types';

export const authService = {
  login: async (email: string, password: string, role: Role): Promise<AuthResponse> => {
    let url = '/auth/signin'; // Mặc định là Client
    if (role === Role.EMPLOYEE) url = '/employee/auth/signin';
    if (role === Role.MANAGER) url = '/manager/auth/signin';
    
    return await axiosClient.post(url, { email, password });
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return await axiosClient.post('/auth/signup', { name, email, password });
  },

  logout: async (role: Role): Promise<void> => {
    let url = '/auth/logout';
    if (role === Role.EMPLOYEE) url = '/employee/auth/logout';
    if (role === Role.MANAGER) url = '/manager/auth/logout';
    await axiosClient.post(url);
  },

  updateProfile: async (id: number, data: Partial<User>, role: Role): Promise<User> => {
     let url = `/auth/${id}`;
    if (role === Role.EMPLOYEE) url = `/employee/auth/profile/${id}`;
    if (role === Role.MANAGER) url = `/manager/auth/profile/${id}`;
    return await axiosClient.put(url, data);
  }
};
