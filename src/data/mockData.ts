import { Product, Order, DashboardStats } from '../types';

export const mockProducts: Product[] = [
  // Tradicional
  {
    id: '1',
    nome: 'Pizza Margherita',
    categoria: 'tradicional',
    descricao: 'Molho de tomate, mussarela, manjericão',
    preco: 3.50,
    estoque: 50,
    imagem: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    nome: 'Pizza Calabresa',
    categoria: 'tradicional',
    descricao: 'Molho de tomate, mussarela, calabresa, cebola',
    preco: 3.50,
    estoque: 45,
    imagem: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    nome: 'Pizza Portuguesa',
    categoria: 'tradicional',
    descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola',
    preco: 3.50,
    estoque: 40,
    imagem: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Premium
  {
    id: '4',
    nome: 'Pizza Frango Catupiry',
    categoria: 'premium',
    descricao: 'Molho de tomate, mussarela, frango desfiado, catupiry',
    preco: 4.00,
    estoque: 35,
    imagem: 'https://images.pexels.com/photos/4394612/pexels-photo-4394612.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    nome: 'Pizza Bacon',
    categoria: 'premium',
    descricao: 'Molho de tomate, mussarela, bacon crocante',
    preco: 4.00,
    estoque: 30,
    imagem: 'https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Especial
  {
    id: '6',
    nome: 'Pizza Quatro Queijos',
    categoria: 'especial',
    descricao: 'Mussarela, parmesão, gorgonzola, catupiry',
    preco: 4.50,
    estoque: 25,
    imagem: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '7',
    nome: 'Pizza Camarão',
    categoria: 'especial',
    descricao: 'Molho branco, mussarela, camarão, catupiry',
    preco: 4.50,
    estoque: 20,
    imagem: 'https://images.pexels.com/photos/3915906/pexels-photo-3915906.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Refrigerantes
  {
    id: '8',
    nome: 'Coca-Cola 350ml',
    categoria: 'refrigerantes',
    descricao: 'Refrigerante de cola gelado',
    preco: 2.50,
    estoque: 100,
    imagem: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '9',
    nome: 'Guaraná Antarctica 350ml',
    categoria: 'refrigerantes',
    descricao: 'Refrigerante de guaraná gelado',
    preco: 2.50,
    estoque: 80,
    imagem: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Pizza Margherita',
        quantidade: 2,
        precoUnit: 3.50,
        observacao: 'Sem manjericão'
      },
      {
        id: '2',
        productId: '8',
        productName: 'Coca-Cola 350ml',
        quantidade: 1,
        precoUnit: 2.50
      }
    ],
    status: 'em_andamento',
    observacao: 'Entregar no portão',
    total: 9.50,
    createdAt: new Date('2025-01-11T10:30:00'),
    entregador: 'João Silva'
  },
  {
    id: '2',
    userId: '1',
    items: [
      {
        id: '3',
        productId: '4',
        productName: 'Pizza Frango Catupiry',
        quantidade: 1,
        precoUnit: 4.00
      }
    ],
    status: 'finalizado',
    total: 4.00,
    createdAt: new Date('2025-01-10T19:15:00'),
    entregador: 'Maria Santos'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalVendas: 1250.75,
  pedidosHoje: 8,
  produtosMaisVendidos: [
    { nome: 'Pizza Margherita', quantidade: 15 },
    { nome: 'Pizza Calabresa', quantidade: 12 },
    { nome: 'Pizza Frango Catupiry', quantidade: 10 },
    { nome: 'Coca-Cola 350ml', quantidade: 25 }
  ]
};