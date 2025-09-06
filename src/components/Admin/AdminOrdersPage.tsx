import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, User, FileText } from 'lucide-react';

const statusConfig = {
  nao_iniciado: { label: 'Não Iniciado', color: 'text-orange-600 bg-orange-100', icon: AlertCircle },
  em_andamento: { label: 'Em Andamento', color: 'text-blue-600 bg-blue-100', icon: Clock },
  finalizado: { label: 'Finalizado', color: 'text-green-600 bg-green-100', icon: CheckCircle }
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('pizzaria_token');
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Carregando pedidos...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestão de Pedidos</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status];
          const StatusIcon = statusInfo.icon;
          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Pedido #{order.id.slice(-6)}</h3>
                  <p className="text-gray-600">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${statusInfo.color}`}>
                  <StatusIcon size={16} />
                  <span>{statusInfo.label}</span>
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="font-bold">Total: R$ {order.total.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
