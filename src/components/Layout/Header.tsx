import React from 'react';
import { ShoppingCart, User, LogOut, Pizza } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-red-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <Pizza size={32} />
            <div>
              <h1 className="text-2xl font-bold">Rodrigo's Delivery</h1>
              <p className="text-red-100 text-sm">Pizza artesanal com sabor único</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {user?.tipo === 'proprietario' ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'dashboard' 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-500'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('admin-products')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'admin-products' 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-500'
                  }`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => onNavigate('admin-orders')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'admin-orders' 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-500'
                  }`}
                >
                  Pedidos
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('cardapio')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'cardapio' 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-500'
                  }`}
                >
                  Cardápio
                </button>
                <button
                  onClick={() => onNavigate('pedidos')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'pedidos' 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-500'
                  }`}
                >
                  Meus Pedidos
                </button>
                <button
                  onClick={() => onNavigate('carrinho')}
                  className={`relative px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'carrinho' 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-500'
                  }`}
                >
                  <ShoppingCart size={20} className="inline mr-2" />
                  Carrinho
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span className="text-sm">{user?.nome}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-red-500 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}