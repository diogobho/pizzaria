import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockOrders } from '../../data/mockData';

export function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [observacaoGeral, setObservacaoGeral] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalizarPedido = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new order (in a real app, this would be sent to the backend)
    const newOrder = {
      id: `order-${Date.now()}`,
      userId: user!.id,
      items: items.map((item, index) => ({
        id: `item-${index}`,
        productId: item.product.id,
        productName: item.product.nome,
        quantidade: item.quantidade,
        precoUnit: item.product.preco,
        observacao: item.observacao
      })),
      status: 'nao_iniciado' as const,
      observacao: observacaoGeral,
      total: total,
      createdAt: new Date()
    };
    
    // Add to mock orders (in a real app, this would be handled by the backend)
    mockOrders.push(newOrder);
    
    clearCart();
    setObservacaoGeral('');
    setIsProcessing(false);
    
    alert('Pedido realizado com sucesso! Acompanhe o status na página "Meus Pedidos".');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Seu carrinho está vazio</h1>
        <p className="text-xl text-gray-600 mb-8">
          Que tal adicionar algumas pizzas deliciosas?
        </p>
        <button
          onClick={() => window.location.reload()} // In a real app, use proper navigation
          className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Ver Cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Seu Carrinho</h1>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Cart Items */}
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.product.id} className="p-6 flex items-center space-x-4">
              <img
                src={item.product.imagem}
                alt={item.product.nome}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.product.nome}</h3>
                <p className="text-gray-600">{item.product.descricao}</p>
                {item.observacao && (
                  <p className="text-sm text-orange-600 mt-1">
                    <strong>Obs:</strong> {item.observacao}
                  </p>
                )}
                <div className="text-lg font-bold text-red-600 mt-2">
                  R$ {item.product.preco.toFixed(2)} cada
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {item.quantidade}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                  className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">
                  R$ {(item.product.preco * item.quantidade).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors mt-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="mb-6">
            <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-2">
              Observações do pedido
            </label>
            <textarea
              id="observacao"
              value={observacaoGeral}
              onChange={(e) => setObservacaoGeral(e.target.value)}
              placeholder="Instruções especiais para entrega, preferências, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-gray-800">
              Total: R$ {total.toFixed(2)}
            </div>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 transition-colors font-semibold"
            >
              Limpar carrinho
            </button>
          </div>

          <button
            onClick={handleFinalizarPedido}
            disabled={isProcessing}
            className="w-full bg-red-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processando pedido...' : 'Finalizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}