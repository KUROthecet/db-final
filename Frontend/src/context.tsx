
import React, { useState, useEffect } from 'react';
import { useAuth } from './store/AuthContext';
import { useCart } from './store/CartContext';
import { productService } from './features/products/services/productService';
import { Product } from './types';

// Adapter for legacy components using `useApp`
export const useApp = () => {
  const auth = useAuth();
  const cart = useCart();
  
  // Keep local product state for sync if needed, though most components should now use productService direct
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      productService.getMenu().then(setProducts).catch(console.error);
  }, []);

  return {
    ...auth,
    ...cart,
    products,
    // Shim for any components still looking for 'users' from the old context
    users: [], 
    updateOrderStatus: async () => console.warn("Use orderService directly"),
    addEmployee: () => console.warn("Use authService/adminService"),
    updateEmployee: () => {},
    deleteEmployee: () => {},
    addProduct: () => console.warn("Use productService"),
    updateProduct: () => {},
    deleteProduct: () => {},
  };
};

export const AppProvider = ({children}: {children: React.ReactNode}) => {
    return <>{children}</>;
}
