// Estado global da aplicação
const state = {
   user: null,
   currentPage: 'home',
   products: [],
   cart: [],
   orders: []
};

// API helpers
const api = {
   async request(endpoint, options = {}) {
       const response = await fetch(`http://161.97.127.54/api${endpoint}`, {
           credentials: 'include',
           headers: {
               'Content-Type': 'application/json',
               ...options.headers
           },
           ...options
       });
       return response.json();
   },
   
   async login(email, password) {
       return this.request('/auth/login', {
           method: 'POST',
           body: JSON.stringify({ email, senha: password })
       });
   },
   
   async getProducts() {
       return this.request('/products');
   },
   
   async getOrders() {
       return this.request('/orders/my-orders');
   }
};

// Componentes da interface
const components = {
   header(user) {
       const isAdmin = user?.tipo === 'proprietario';
       const cartCount = state.cart.length;
       
       return `
           <header class="bg-red-600 text-white shadow-lg">
               <div class="container mx-auto px-4 py-4">
                   <div class="flex items-center justify-between">
                       <div class="flex items-center space-x-2">
                           <i data-lucide="pizza" class="w-8 h-8"></i>
                           <div>
                               <h1 class="text-xl font-bold">Rodrigo's Delivery</h1>
                               <p class="text-sm opacity-90">Pizza artesanal com sabor único</p>
                           </div>
                       </div>
                       
                       <nav class="flex items-center space-x-6">
                           ${isAdmin ? `
                               <button onclick="showPage('dashboard')" class="hover:text-red-200 transition">Dashboard</button>
                               <button onclick="showPage('admin-products')" class="hover:text-red-200 transition">Produtos</button>
                               <button onclick="showPage('admin-orders')" class="hover:text-red-200 transition">Pedidos</button>
                           ` : `
                               <button onclick="showPage('home')" class="hover:text-red-200 transition">Home</button>
                               <button onclick="showPage('cardapio')" class="hover:text-red-200 transition">Cardápio</button>
                               <button onclick="showPage('pedidos')" class="hover:text-red-200 transition">Meus Pedidos</button>
                               <button onclick="showPage('carrinho')" class="hover:text-red-200 transition flex items-center space-x-1">
                                   <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                   <span>Carrinho</span>
                                   ${cartCount > 0 ? `<span class="bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">${cartCount}</span>` : ''}
                               </button>
                           `}
                           
                           <div class="flex items-center space-x-4">
                               <span class="text-sm">${user.nome}</span>
                               <button onclick="logout()" class="hover:text-red-200 transition">Sair</button>
                           </div>
                       </nav>
                   </div>
               </div>
           </header>
       `;
   },
   
   cardapio() {
       const categories = ['todos', 'tradicional', 'premium', 'especial', 'refrigerantes'];
       
       return `
           <div class="container mx-auto px-4 py-8">
               <div class="text-center mb-8">
                   <h1 class="text-4xl font-bold text-gray-800 mb-4">Nosso Cardápio</h1>
                   <p class="text-xl text-gray-600">Escolha entre nossas deliciosas opções</p>
               </div>
               
               <div class="flex justify-center mb-8">
                   <div class="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                       ${categories.map(cat => `
                           <button onclick="filterProducts('${cat}')" 
                                   class="px-4 py-2 rounded-md transition category-btn ${cat === 'todos' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-200'}"
                                   data-category="${cat}">
                               ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                           </button>
                       `).join('')}
                   </div>
               </div>
               
               <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   ${this.productGrid(state.products)}
               </div>
           </div>
       `;
   },
   
   productGrid(products) {
       return products.map(product => `
           <div class="bg-white rounded-lg shadow-lg overflow-hidden product-card" data-category="${product.categoria}">
               <img src="${product.imagem}" alt="${product.nome}" class="w-full h-48 object-cover">
               <div class="p-6">
                   <h3 class="text-xl font-bold text-gray-800 mb-2">${product.nome}</h3>
                   <p class="text-gray-600 mb-2">${product.descricao}</p>
                   <div class="flex items-center justify-between mb-4">
                       <span class="text-2xl font-bold text-red-600">R$ ${product.preco.toFixed(2)}</span>
                       <span class="text-sm text-gray-500">Estoque: ${product.estoque}</span>
                   </div>
                   
                   <textarea placeholder="Observações (ex: tirar cebola, massa fina...)" 
                             class="w-full p-2 border rounded mb-4 resize-none" 
                             rows="2" 
                             id="obs-${product.id}"></textarea>
                   
                   <div class="flex items-center justify-between">
                       <div class="flex items-center space-x-2">
                           <button onclick="changeQuantity('${product.id}', -1)" class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">-</button>
                           <span id="qty-${product.id}" class="font-semibold">0</span>
                           <button onclick="changeQuantity('${product.id}', 1)" class="bg-red-600 text-white w-8 h-8 rounded-full">+</button>
                       </div>
                       <button onclick="addToCart('${product.id}')" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                           Adicionar
                       </button>
                   </div>
               </div>
           </div>
       `).join('');
   }
};

// Funções de navegação e controle
function showPage(page) {
   state.currentPage = page;
   renderCurrentPage();
}

function filterProducts(category) {
   const buttons = document.querySelectorAll('.category-btn');
   buttons.forEach(btn => {
       btn.classList.remove('bg-red-600', 'text-white');
       btn.classList.add('text-gray-600', 'hover:bg-gray-200');
   });
   
   const activeBtn = document.querySelector(`[data-category="${category}"]`);
   activeBtn.classList.add('bg-red-600', 'text-white');
   activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-200');
   
   const products = category === 'todos' ? state.products : state.products.filter(p => p.categoria === category);
   document.getElementById('products-grid').innerHTML = components.productGrid(products);
   initializeLucideIcons();
}

let quantities = {};

function changeQuantity(productId, change) {
   quantities[productId] = Math.max(0, (quantities[productId] || 0) + change);
   document.getElementById(`qty-${productId}`).textContent = quantities[productId];
}

function addToCart(productId) {
   const quantity = quantities[productId] || 0;
   if (quantity === 0) return;
   
   const product = state.products.find(p => p.id === productId);
   const observacao = document.getElementById(`obs-${productId}`).value;
   
   const existingItem = state.cart.find(item => item.product.id === productId && item.observacao === observacao);
   
   if (existingItem) {
       existingItem.quantidade += quantity;
   } else {
       state.cart.push({
           product,
           quantidade: quantity,
           observacao
       });
   }
   
   quantities[productId] = 0;
   document.getElementById(`qty-${productId}`).textContent = '0';
   document.getElementById(`obs-${productId}`).value = '';
   
   updateCartDisplay();
   alert('Produto adicionado ao carrinho!');
}

function updateCartDisplay() {
   // Atualizar contador no header
   renderCurrentPage();
}

async function renderCurrentPage() {
   const mainApp = document.getElementById('mainApp');
   
   if (!state.user) return;
   
   let content = components.header(state.user);
   
   switch (state.currentPage) {
       case 'home':
           content += `
               <div class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20">
                   <div class="container mx-auto px-4 text-center">
                       <div class="mb-8">
                           <div class="mx-auto w-24 h-24 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                               <i data-lucide="pizza" class="text-white w-12 h-12"></i>
                           </div>
                           <h1 class="text-5xl md:text-6xl font-bold text-gray-800 mb-4">Rodrigo's Delivery</h1>
                           <p class="text-xl md:text-2xl text-gray-600 mb-8">Pizza artesanal com sabor único, entregue na sua casa</p>
                       </div>
                       
                       <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                           <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="showPage('cardapio')">
                               <i data-lucide="pizza" class="w-16 h-16 text-red-600 mx-auto mb-4"></i>
                               <h3 class="text-xl font-bold mb-2">Cardápio</h3>
                               <p class="text-gray-600">Explore nossas deliciosas pizzas artesanais</p>
                           </div>
                           
                           <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="showPage('carrinho')">
                               <i data-lucide="shopping-cart" class="w-16 h-16 text-orange-600 mx-auto mb-4"></i>
                               <h3 class="text-xl font-bold mb-2">Carrinho</h3>
                               <p class="text-gray-600">Finalize seu pedido rapidamente</p>
                           </div>
                           
                           <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer" onclick="showPage('pedidos')">
                               <i data-lucide="clock" class="w-16 h-16 text-yellow-600 mx-auto mb-4"></i>
                               <h3 class="text-xl font-bold mb-2">Meus Pedidos</h3>
                               <p class="text-gray-600">Acompanhe o status dos seus pedidos</p>
                           </div>
                       </div>
                   </div>
               </div>
           `;
           break;
           
       case 'cardapio':
           content += components.cardapio();
           break;
           
       case 'carrinho':
           content += `
               <div class="container mx-auto px-4 py-8">
                   <h1 class="text-3xl font-bold text-gray-800 mb-8">Seu Carrinho</h1>
                   ${state.cart.length === 0 ? `
                       <div class="text-center py-16">
                           <i data-lucide="shopping-bag" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                           <h2 class="text-2xl font-bold text-gray-600 mb-4">Seu carrinho está vazio</h2>
                           <button onclick="showPage('cardapio')" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
                               Ver Cardápio
                           </button>
                       </div>
                   ` : `
                       <div class="bg-white rounded-lg shadow-lg p-6">
                           ${state.cart.map(item => `
                               <div class="flex items-center justify-between border-b pb-4 mb-4">
                                   <div class="flex items-center space-x-4">
                                       <img src="${item.product.imagem}" alt="${item.product.nome}" class="w-16 h-16 rounded object-cover">
                                       <div>
                                           <h3 class="font-bold">${item.product.nome}</h3>
                                           <p class="text-gray-600">${item.product.descricao}</p>
                                           ${item.observacao ? `<p class="text-sm text-orange-600">Obs: ${item.observacao}</p>` : ''}
                                       </div>
                                   </div>
                                   <div class="text-right">
                                       <p class="font-bold">R$ ${(item.product.preco * item.quantidade).toFixed(2)}</p>
                                       <p class="text-gray-600">Qtd: ${item.quantidade}</p>
                                   </div>
                               </div>
                           `).join('')}
                           
                           <div class="border-t pt-4">
                               <div class="flex justify-between items-center mb-4">
                                   <span class="text-2xl font-bold">Total: R$ ${state.cart.reduce((total, item) => total + (item.product.preco * item.quantidade), 0).toFixed(2)}</span>
                                   <button onclick="clearCart()" class="text-red-600 hover:text-red-800 transition">Limpar Carrinho</button>
                               </div>
                               
                               <textarea placeholder="Observações do pedido..." class="w-full p-3 border rounded mb-4" rows="3" id="orderObservations"></textarea>
                               
                               <button onclick="finalizarPedido()" class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-bold">
                                   Finalizar Pedido
                               </button>
                           </div>
                       </div>
                   `}
               </div>
           `;
           break;
           
       default:
           content += `<div class="container mx-auto px-4 py-8"><p>Página em desenvolvimento...</p></div>`;
   }
   
   mainApp.innerHTML = content;
   initializeLucideIcons();
}

function clearCart() {
   state.cart = [];
   renderCurrentPage();
}

async function finalizarPedido() {
   if (state.cart.length === 0) return;
   
   // Simular finalização do pedido
   alert('Pedido realizado com sucesso! Acompanhe o status na página "Meus Pedidos".');
   clearCart();
}

function initializeLucideIcons() {
   if (typeof lucide !== 'undefined') {
       lucide.createIcons();
   }
}

async function logout() {
   state.user = null;
   state.cart = [];
   showLogin();
}

// Funções de inicialização
function showLogin() {
   document.getElementById('loading').classList.add('hidden');
   document.getElementById('loginScreen').classList.remove('hidden');
   document.getElementById('mainApp').classList.add('hidden');
}

function showApp() {
   document.getElementById('loading').classList.add('hidden');
   document.getElementById('loginScreen').classList.add('hidden');
   document.getElementById('mainApp').classList.remove('hidden');
   renderCurrentPage();
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
   // Tentar carregar produtos
   try {
       const products = await api.getProducts();
       state.products = products;
   } catch (error) {
       console.error('Erro ao carregar produtos:', error);
   }
   
   setTimeout(showLogin, 1000);
   
   // Login form
   document.getElementById('loginForm').addEventListener('submit', async function(e) {
       e.preventDefault();
       
       const email = document.getElementById('email').value;
       const password = document.getElementById('password').value;
       
       try {
           const response = await api.login(email, password);
           if (response.user) {
               state.user = response.user;
               showApp();
           } else {
               alert('Login inválido!');
           }
       } catch (error) {
           alert('Erro no login. Verifique suas credenciais.');
       }
   });
});
