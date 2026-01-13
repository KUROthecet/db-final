import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import { Role } from './types';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup'; // New
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; 
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking'; 
import OrderSuccess from './pages/OrderSuccess'; // New
import CustomerProfile from './pages/CustomerProfile'; // New
import { About, Contact, Policy } from './pages/StaticPages'; // New
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: React.PropsWithChildren<{ allowedRoles: Role[] }>) => {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        
        {/* Customer Routes */}
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

        {/* Employee Routes */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={[Role.EMPLOYEE, Role.MANAGER]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[Role.MANAGER]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
