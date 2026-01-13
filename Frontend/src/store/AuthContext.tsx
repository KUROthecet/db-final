
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authService } from '../features/auth/services/authService';
import axiosClient from '../api/axiosClient';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  signup: (name: string, email: string, role: Role, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        const savedUserStr = localStorage.getItem('bms_user');
        if (savedUserStr) {
            try {
                const savedUser = JSON.parse(savedUserStr);
                setCurrentUser(savedUser);
                try {
                    let url = `/auth/${savedUser.id}`;
                    if (savedUser.role === Role.EMPLOYEE) url = `/employee/auth/profile/${savedUser.id}`;
                    if (savedUser.role === Role.MANAGER) url = `/manager/auth/profile/${savedUser.id}`;
                    await axiosClient.get(url);
                } catch (e) {
                    console.warn("Session expired or invalid");
                    setCurrentUser(null);
                    localStorage.removeItem('bms_user');
                }
            } catch (e) {
                localStorage.removeItem('bms_user');
            }
        }
        setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string, role: Role): Promise<void> => {
    try {
      const res = await authService.login(email, pass, role);
      if (res.user) {
        const userWithRole = { ...res.user, role }; 
        setCurrentUser(userWithRole);
        localStorage.setItem('bms_user', JSON.stringify(userWithRole));
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error?.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  const signup = async (name: string, email: string, role: Role, password: string): Promise<void> => {
    try {
      await authService.register(name, email, password);
    } catch (error: any) {
        console.error("Signup failed:", error);
        throw new Error(error?.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  const logout = async () => {
    if (currentUser) {
        try {
            await authService.logout(currentUser.role);
        } catch (e) { console.error(e); }
    }
    setCurrentUser(null);
    localStorage.removeItem('bms_user');
    window.location.href = '/#/login';
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    try {
        const updated = await authService.updateProfile(currentUser.id, data, currentUser.role);
        const newUser = { ...currentUser, ...updated };
        setCurrentUser(newUser);
        localStorage.setItem('bms_user', JSON.stringify(newUser));
    } catch (e: any) {
        console.error(e);
        throw new Error(e?.response?.data?.error || "Update failed");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
