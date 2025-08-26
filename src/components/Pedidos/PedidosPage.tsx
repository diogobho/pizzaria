import React from 'react';
import { Clock, CheckCircle, AlertCircle, Repeat } from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { mockProducts } from '../../data/mockData';

const statusConfig = {
  nao_iniciado: {
    label: 'Não Iniciado',
    color: 'text-orange-600 bg-orange-100',
    icon: AlertCircle
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'text-blue-600 bg-blue-100',
    icon: Clock
  },
  finalizado: {
    label: 'Finalizado',
    color: 'text-green-600 bg-green-100',
    icon: CheckCircle
  }
};

export function PedidosPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // Filter orders for current user
  const userOrders = mockOrders.filter(order => order.userId === user?.id);

  const handleRepeatOrder = (orderId: string) => {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;

    // Add all items from the order back to cart
    order.items.forEach(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantidade, item.observacao);
      }
    });

    alert('Itens adicionados ao carrinho!');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (userOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Clock size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Nenhum pedido encontrado</h1>
        <p className="text-xl text-gray-600 mb-8">
          Que tal fazer seu primeiro pedido?
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Meus Pedidos</h1>

      <div className="space-y-6">
        {userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((order) => {
          const statusInfo = statusConfig[order.status];
          const StatusIcon = statusInfo.icon;

          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${statusInfo.color}`}>
                      <StatusIcon size={16} />
                      <span>{statusInfo.label}</span>
                    </span>
                    <button
                      onClick={() => handleRepeatOrder(order.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Repetir pedido"
                    >
                      <Repeat size={20} />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-medium">{item.quantidade}x {item.productName}</span>
                          {item.observacao && (
                            <p className="text-sm text-orange-600">Obs: {item.observacao}</p>
                          )}
                        </div>
                        <span className="font-semibold">
                          R$ {(item.quantidade * item.precoUnit).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.observacao && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Observações:</strong> {order.observacao}
                      </p>
                    </div>
                  )}

                  {order.entregador && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-700">
                        <strong>Entregador:</strong> {order.entregador}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold">Total: R$ {order.total.toFixed(2)}</span>
                    {order.status !== 'finalizado' && (
                      <div className="text-sm text-gray-600">
                        {order.status === 'nao_iniciado' && 'Aguardando confirmação...'}
                        {order.status === 'em_andamento' && 'Preparando seu pedido...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}