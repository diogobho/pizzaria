import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, User, FileText } from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import { Order } from '../../types';

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

const entregadores = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const handleAssignDeliverer = (orderId: string, deliverer: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, entregador: deliverer }
        : order
    ));
  };

  const handleGeneratePDF = (orderId: string) => {
    // In a real app, this would generate a PDF
    alert(`PDF gerado para o pedido #${orderId.slice(-6).toUpperCase()}`);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão de Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos da pizzaria</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="nao_iniciado">Não Iniciado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((order) => {
          const statusInfo = statusConfig[order.status];
          const StatusIcon = statusInfo.icon;

          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                    <p className="text-lg font-semibold text-red-600 mt-1">
                      Total: R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGeneratePDF(order.id)}
                      className="text-blue-600 hover:text-blue-700 transition-colors p-2"
                      title="Gerar PDF"
                    >
                      <FileText size={20} />
                    </button>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${statusInfo.color}`}>
                      <StatusIcon size={16} />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Itens do Pedido</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
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
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <strong>Observações do cliente:</strong> {order.observacao}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Status Management */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status do Pedido
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="nao_iniciado">Não Iniciado</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                    </div>

                    {/* Deliverer Assignment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entregador
                      </label>
                      <div className="flex items-center space-x-2">
                        <User size={20} className="text-gray-400" />
                        <select
                          value={order.entregador || ''}
                          onChange={(e) => handleAssignDeliverer(order.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Selecionar entregador</option>
                          {entregadores.map((entregador) => (
                            <option key={entregador} value={entregador}>
                              {entregador}
                            </option>
                          ))}
                        </select>
                      </div>
                      {order.entregador && (
                        <p className="text-sm text-green-600 mt-1">
                          Atribuído a: {order.entregador}
                        </p>
                      )}
                    </div>

                    {/* Scheduled Delivery */}
                    {order.dataAgendada && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          <strong>Entrega agendada para:</strong><br />
                          {formatDate(order.dataAgendada)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Clock size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">
            {filterStatus === 'all' ? 'Nenhum pedido encontrado' : `Nenhum pedido ${statusConfig[filterStatus as keyof typeof statusConfig]?.label.toLowerCase()}`}
          </p>
        </div>
      )}
    </div>
  );
}