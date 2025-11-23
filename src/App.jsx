import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import TransactionsPage from './pages/TransactionsPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="pos" element={<POSPage />} />
        <Route path="products" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ProductsPage />
          </ProtectedRoute>
        } />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="settings" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
