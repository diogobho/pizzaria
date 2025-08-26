import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Rua das Pizzas, 123 - São Paulo</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Horário de Funcionamento</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Segunda a Quinta: 18h às 23h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Sexta a Domingo: 18h às 00h</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre</h3>
            <p className="text-gray-300 text-sm">
              Rodrigo's Delivery oferece as melhores pizzas artesanais da região, 
              com ingredientes frescos e massa preparada diariamente.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Rodrigo's Delivery. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}