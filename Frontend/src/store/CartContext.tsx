
import React, { createContext, useContext, useState } from 'react';
import { Product, CartItem, Order } from '../types';
import { orderService } from '../features/orders/services/orderService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderDetails: any) => Promise<void>;
  orders: Order[];
  fetchMyOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderDetails: any) => {
    if (!currentUser) throw new Error("Must be logged in");
    
    const payload = {
        ...orderDetails,
        items: cart,
        prices: {
            total: orderDetails.prices.total
        }
    };

    await orderService.createOrder(payload);
    clearCart();
  };

  const fetchMyOrders = async () => {
      if(currentUser) {
          try {
            const history = await orderService.getMyHistory(currentUser.id);
            setOrders(history);
          } catch (e) { console.error(e) }
      }
  }

  return (
    <CartContext.Provider value={{
      cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateCartQuantity, 
      clearCart, placeOrder, orders, fetchMyOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
