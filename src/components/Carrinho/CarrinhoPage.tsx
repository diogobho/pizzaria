import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [observacaoGeral, setObservacaoGeral] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para dados do cliente
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEndereco, setClienteEndereco] = useState('');

  const handleFinalizarPedido = async () => {
    if (items.length === 0) return;
    
    // Validar dados do cliente
    if (!clienteNome.trim() || !clienteTelefone.trim() || !clienteEndereco.trim()) {
      alert('Por favor, preencha todos os dados do cliente (Nome, Telefone e Endereço)');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('pizzaria_token');
      
      const pedidoData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantidade: item.quantidade,
          preco_unit: item.product.preco,
          observacao: item.observacao || ''
        })),
        observacao: observacaoGeral,
        cliente_nome: clienteNome,
        cliente_telefone: clienteTelefone,
        cliente_endereco: clienteEndereco
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(pedidoData)
      });

      if (response.ok) {
        clearCart();
        setObservacaoGeral('');
        setClienteNome('');
        setClienteTelefone('');
        setClienteEndereco('');
        alert('Pedido realizado com sucesso!');
      } else {
        throw new Error('Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    }
    
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Carrinho vazio</h1>
        <p className="text-xl text-gray-600 mb-8">
          Adicione produtos ao carrinho para criar um pedido
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Pedido</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Coluna Esquerda - Itens do Carrinho */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Itens do Pedido</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.imagem} 
                    alt={item.product.nome} 
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{item.product.nome}</h3>
                    <p className="text-gray-600 text-sm">{item.product.descricao}</p>
                    {item.observacao && (
                      <p className="text-sm text-orange-600">Obs: {item.observacao}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantidade}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                      className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">R$ {(item.product.preco * item.quantidade).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">Total: R$ {total.toFixed(2)}</span>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 transition"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Dados do Cliente */}
        <div className="space-y-6">
          {/* Dados do Cliente */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Dados do Cliente</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={clienteTelefone}
                  onChange={(e) => setClienteTelefone(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço de Entrega *
                </label>
                <textarea
                  value={clienteEndereco}
                  onChange={(e) => setClienteEndereco(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Rua, número, bairro, cidade..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Observações do Pedido */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Observações do Pedido</h2>
            <textarea
              placeholder="Observações gerais do pedido..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
              value={observacaoGeral}
              onChange={(e) => setObservacaoGeral(e.target.value)}
            />
          </div>

          {/* Botão Finalizar */}
          <button
            onClick={handleFinalizarPedido}
            disabled={isProcessing || items.length === 0}
            className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
