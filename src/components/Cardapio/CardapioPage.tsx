import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

const categoryNames = {
  tradicional: 'Tradicionais',
  premium: 'Premium',
  especial: 'Especiais',
  refrigerantes: 'Refrigerantes'
};

const categoryColors = {
  tradicional: 'border-red-200 bg-red-50',
  premium: 'border-orange-200 bg-orange-50',
  especial: 'border-yellow-200 bg-yellow-50',
  refrigerantes: 'border-blue-200 bg-blue-50'
};

export function CardapioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [observations, setObservations] = useState<{ [key: string]: string }>({});
  const { addToCart } = useCart();

  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.categoria === selectedCategory);

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const observation = observations[product.id] || '';
    
    addToCart(product, quantity, observation);
    
    // Reset form
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    setObservations(prev => ({ ...prev, [product.id]: '' }));
    
    // Show success message (you could use a toast library here)
    alert('Produto adicionado ao carrinho!');
  };

  const categories = ['all', 'tradicional', 'premium', 'especial', 'refrigerantes'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Nosso Cardápio</h1>
        <p className="text-xl text-gray-600">Escolha entre nossas deliciosas opções</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300'
            }`}
          >
            {category === 'all' ? 'Todos' : categoryNames[category as keyof typeof categoryNames]}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
              categoryColors[product.categoria]
            } hover:shadow-xl transition-shadow`}
          >
            <div className="aspect-w-16 aspect-h-10">
              <img
                src={product.imagem}
                alt={product.nome}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{product.nome}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    R$ {product.preco.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Estoque: {product.estoque}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{product.descricao}</p>
              
              {/* Observation Input */}
              <div className="mb-4">
                <textarea
                  placeholder="Observações (ex: tirar cebola, massa fina...)"
                  value={observations[product.id] || ''}
                  onChange={(e) => setObservations(prev => ({
                    ...prev,
                    [product.id]: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              
              {/* Quantity and Add to Cart */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {quantities[product.id] || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.estoque === 0 || (quantities[product.id] || 0) === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {product.estoque === 0 ? 'Sem estoque' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}