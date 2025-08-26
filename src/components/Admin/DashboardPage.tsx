import React from 'react';
import { TrendingUp, Package, Clock, Users } from 'lucide-react';
import { mockDashboardStats, mockOrders } from '../../data/mockData';

export function DashboardPage() {
  const stats = mockDashboardStats;
  
  const todayOrders = mockOrders.filter(order => {
    const today = new Date();
    return order.createdAt.toDateString() === today.toDateString();
  });

  const pendingOrders = mockOrders.filter(order => order.status !== 'finalizado').length;

  const cards = [
    {
      title: 'Total de Vendas',
      value: `R$ ${stats.totalVendas.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pedidos Hoje',
      value: stats.pedidosHoje.toString(),
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pedidos Pendentes',
      value: pendingOrders.toString(),
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Produtos Cadastrados',
      value: '9',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-2xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{card.value}</div>
            <div className="text-gray-600 text-sm">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Sold Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            {stats.produtosMaisVendidos.map((produto, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-800">{produto.nome}</span>
                </div>
                <div className="text-gray-600">
                  {produto.quantidade} vendas
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Pedidos de Hoje</h3>
          <div className="space-y-4">
            {todayOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">
                    Pedido #{order.id.slice(-6).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items.length} item(s) - {order.createdAt.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">R$ {order.total.toFixed(2)}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'finalizado' ? 'bg-green-100 text-green-600' :
                    order.status === 'em_andamento' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {order.status === 'finalizado' ? 'Finalizado' :
                     order.status === 'em_andamento' ? 'Em Andamento' : 'Não Iniciado'}
                  </div>
                </div>
              </div>
            ))}
            {todayOrders.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum pedido hoje ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}