export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'proprietario';
}

export interface Product {
  id: string;
  nome: string;
  categoria: 'tradicional' | 'premium' | 'especial' | 'refrigerantes';
  descricao: string;
  preco: number;
  estoque: number;
  imagem?: string;
}

export interface CartItem {
  product: Product;
  quantidade: number;
  observacao?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'nao_iniciado' | 'em_andamento' | 'finalizado';
  observacao?: string;
  total: number;
  createdAt: Date;
  entregador?: string;
  dataAgendada?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantidade: number;
  precoUnit: number;
  observacao?: string;
}

export interface DashboardStats {
  totalVendas: number;
  pedidosHoje: number;
  produtosMaisVendidos: Array<{
    nome: string;
    quantidade: number;
  }>;
}