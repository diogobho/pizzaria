import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Clock, Users } from 'lucide-react';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalVendas: 0,
    pedidosHoje: 0,
    pedidosPendentes: 0,
    produtosCadastrados: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('pizzaria_token');
      const response = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cards = [
    { title: 'Total de Vendas', value: `R$ ${stats.totalVendas.toFixed(2)}`, icon: TrendingUp, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { title: 'Pedidos Hoje', value: stats.pedidosHoje.toString(), icon: Clock, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Pedidos Pendentes', value: stats.pedidosPendentes.toString(), icon: Package, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Produtos Cadastrados', value: stats.produtosCadastrados.toString(), icon: Users, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' }
  ];

  if (isLoading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
