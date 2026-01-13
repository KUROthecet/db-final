import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { Role } from './types';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; 
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking'; 
import OrderSuccess from './pages/OrderSuccess'; 
import CustomerProfile from './pages/CustomerProfile'; 
import { About, Contact, Policy } from './pages/StaticPages'; 
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';

const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles: Role[] }>) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!currentUser) {
    // Redirect to login, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  
  // Kiểm tra xem có phải trang Login/Signup không
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Kiểm tra xem có phải trang Admin/Employee workspace không
  const isWorkspacePage = location.pathname === '/admin' || location.pathname === '/employee';

  return (
    <>
      {isAuthPage ? (
        // Trang Login/Signup - KHÔNG có Layout (Navbar/Footer)
        <div className="min-h-screen flex flex-col bg-tlj-cream">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      ) : (
        // Các trang khác - CÓ Layout (với hoặc không có Footer tùy loại trang)
        <Layout hideFooter={isWorkspacePage}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetail />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                <OrderSuccess />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                <CustomerProfile />
              </ProtectedRoute>
            } />
            <Route path="/track/:id" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                <OrderTracking />
              </ProtectedRoute>
            } />

            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={[Role.EMPLOYEE, Role.MANAGER]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[Role.MANAGER]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
