import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';

const seedData = {
  users: [
    {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senha: '123456',
      tipo: 'cliente'
    },
    {
      nome: 'Rodrigo',
      email: 'rodrigo@pizzaria.com',
      senha: 'admin123',
      tipo: 'proprietario'
    }
  ],
  
  products: [
    // Tradicional
    {
      nome: 'Pizza Margherita',
      categoria: 'tradicional',
      descricao: 'Molho de tomate, mussarela, manjericão',
      preco: 3.50,
      estoque: 50,
      imagem: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      nome: 'Pizza Calabresa',
      categoria: 'tradicional',
      descricao: 'Molho de tomate, mussarela, calabresa, cebola',
      preco: 3.50,
      estoque: 45,
      imagem: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      nome: 'Pizza Portuguesa',
      categoria: 'tradicional',
      descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola',
      preco: 3.50,
      estoque: 40,
      imagem: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    
    // Premium
    {
      nome: 'Pizza Frango Catupiry',
      categoria: 'premium',
      descricao: 'Molho de tomate, mussarela, frango desfiado, catupiry',
      preco: 4.00,
      estoque: 35,
      imagem: 'https://images.pexels.com/photos/4394612/pexels-photo-4394612.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      nome: 'Pizza Bacon',
      categoria: 'premium',
      descricao: 'Molho de tomate, mussarela, bacon crocante',
      preco: 4.00,
      estoque: 30,
      imagem: 'https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    
    // Especial
    {
      nome: 'Pizza Quatro Queijos',
      categoria: 'especial',
      descricao: 'Mussarela, parmesão, gorgonzola, catupiry',
      preco: 4.50,
      estoque: 25,
      imagem: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      nome: 'Pizza Camarão',
      categoria: 'especial',
      descricao: 'Molho branco, mussarela, camarão, catupiry',
      preco: 4.50,
      estoque: 20,
      imagem: 'https://images.pexels.com/photos/3915906/pexels-photo-3915906.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    
    // Refrigerantes
    {
      nome: 'Coca-Cola 350ml',
      categoria: 'refrigerantes',
      descricao: 'Refrigerante de cola gelado',
      preco: 2.50,
      estoque: 100,
      imagem: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      nome: 'Guaraná Antarctica 350ml',
      categoria: 'refrigerantes',
      descricao: 'Refrigerante de guaraná gelado',
      preco: 2.50,
      estoque: 80,
      imagem: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ],

  deliverers: [
    { nome: 'João Silva', telefone: '(11) 99999-1111' },
    { nome: 'Maria Santos', telefone: '(11) 99999-2222' },
    { nome: 'Pedro Costa', telefone: '(11) 99999-3333' },
    { nome: 'Ana Oliveira', telefone: '(11) 99999-4444' }
  ]
};

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Seeding database...');

    // Seed users
    console.log('Creating users...');
    for (const user of seedData.users) {
      const hashedPassword = await bcrypt.hash(user.senha, 12);
      
      await client.query(
        'INSERT INTO users (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        [user.nome, user.email, hashedPassword, user.tipo]
      );
    }

    // Seed products
    console.log('Creating products...');
    for (const product of seedData.products) {
      await client.query(
        'INSERT INTO products (nome, categoria, descricao, preco, estoque, imagem) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
        [product.nome, product.categoria, product.descricao, product.preco, product.estoque, product.imagem]
      );
    }

    // Seed deliverers
    console.log('Creating deliverers...');
    for (const deliverer of seedData.deliverers) {
      await client.query(
        'INSERT INTO deliverers (nome, telefone) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [deliverer.nome, deliverer.telefone]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };