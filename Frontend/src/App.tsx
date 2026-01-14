import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { Role } from './types';
import { Layout } from './components/Layout';

// Pages - Đảm bảo đường dẫn import chính xác với cấu trúc thư mục của bạn
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; 
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking'; 
import OrderSuccess from './pages/OrderSuccess'; 
import CustomerProfile from './pages/CustomerProfile'; // File đã merge duy nhất
import { About, Contact, Policy } from './pages/StaticPages'; 
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';

/**
 * Component bảo vệ Route: Kiểm tra đăng nhập và phân quyền Role
 */
const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles: Role[] }>) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-tlj-cream font-serif text-tlj-green">
        <div className="w-12 h-12 border-4 border-tlj-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse">Loading Pane e Amore...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Nếu chưa đăng nhập, chuyển hướng sang Login và lưu lại trang đang định vào
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Nếu sai Role, đẩy về trang chủ
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  
  // Kiểm tra trang Auth (Login/Signup) để không hiển thị Navbar/Footer
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Kiểm tra trang quản trị để ẩn Footer cho chuyên nghiệp
  const isWorkspacePage = location.pathname === '/admin' || location.pathname === '/employee';

  return (
    <>
      {isAuthPage ? (
        // ROUTE CHO ĐĂNG NHẬP / ĐĂNG KÝ
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        // ROUTE CHO TOÀN BỘ HỆ THỐNG (CÓ NAVBAR)
        <Layout hideFooter={isWorkspacePage}>
          <Routes>
            {/* --- Public Routes: Ai cũng xem được --- */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetail />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* --- Shared Protected Route: Cho phép TẤT CẢ các Role vào Profile --- */}
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]}>
                <CustomerProfile />
              </ProtectedRoute>
            } />

            {/* --- Customer Routes: Chỉ dành cho khách mua hàng --- */}
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
            <Route path="/track/:id" element={
              <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
                <OrderTracking />
              </ProtectedRoute>
            } />

            {/* --- Staff & Manager Workspace: Khu vực làm việc --- */}
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={[Role.EMPLOYEE, Role.MANAGER]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />

            {/* --- Admin Only: Chỉ dành cho quản lý --- */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[Role.MANAGER]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* --- Bẫy lỗi 404: Tự động về trang chủ --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
