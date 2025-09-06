import { clearOldMockData } from "./utils/clearOldData.js";
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HomePage } from './components/Home/HomePage';
import { CardapioPage } from './components/Cardapio/CardapioPage';
import { CarrinhoPage } from './components/Carrinho/CarrinhoPage';
import { PedidosPage } from './components/Pedidos/PedidosPage';
import { DashboardPage } from './components/Admin/DashboardPage';
import { AdminProductsPage } from './components/Admin/AdminProductsPage';
import { AdminOrdersPage } from './components/Admin/AdminOrdersPage';

function AppContent() {
  clearOldMockData();
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'cardapio':
        return <CardapioPage />;
      case 'carrinho':
        return <CarrinhoPage />;
      case 'pedidos':
        return <PedidosPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'admin-products':
        return <AdminProductsPage />;
      case 'admin-orders':
        return <AdminOrdersPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  clearOldMockData();
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;