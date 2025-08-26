import React from 'react';
import { Pizza, ShoppingCart, History, Star } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Pizza,
      title: 'Cardápio',
      description: 'Explore nossas deliciosas pizzas artesanais',
      action: () => onNavigate('cardapio'),
      color: 'from-red-500 to-red-600'
    },
    {
      icon: ShoppingCart,
      title: 'Carrinho',
      description: 'Finalize seu pedido rapidamente',
      action: () => onNavigate('carrinho'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: History,
      title: 'Meus Pedidos',
      description: 'Acompanhe o status dos seus pedidos',
      action: () => onNavigate('pedidos'),
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
              <Pizza className="text-white" size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              Rodrigo's Delivery
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Pizza artesanal com sabor único, entregue na sua casa
            </p>
            <div className="flex items-center justify-center space-x-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={24} />
              ))}
              <span className="ml-2 text-gray-600">4.9/5 - Avaliação dos clientes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={feature.action}
              >
                <div className="p-8 text-center">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <div className={`inline-block px-6 py-3 bg-gradient-to-r ${feature.color} text-white rounded-lg font-semibold group-hover:shadow-lg transition-shadow`}>
                    Acessar
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Ofertas Especiais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Pizza + Refrigerante</h3>
              <p className="text-xl mb-6">Qualquer pizza tradicional + refrigerante por apenas R$ 5,50</p>
              <button
                onClick={() => onNavigate('cardapio')}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Cardápio
              </button>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Combo Família</h3>
              <p className="text-xl mb-6">2 Pizzas Grandes + 2 Refrigerantes com desconto especial</p>
              <button
                onClick={() => onNavigate('cardapio')}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Aproveitar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}