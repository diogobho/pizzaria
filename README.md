# Pizzaria Rodrigo's Delivery

Sistema completo de delivery para pizzaria com frontend React e backend Node.js + PostgreSQL.

## 🚀 Funcionalidades

### Cliente
- ✅ Tela inicial com navegação intuitiva
- ✅ Cardápio organizado por categorias (Tradicional, Premium, Especial, Refrigerantes)
- ✅ Sistema de carrinho com observações
- ✅ Histórico de pedidos com status em tempo real
- ✅ Possibilidade de repetir pedidos anteriores

### Proprietário
- ✅ Dashboard com métricas de vendas
- ✅ Gestão completa de produtos (CRUD)
- ✅ Gestão de pedidos com alteração de status
- ✅ Associação de entregadores aos pedidos
- ✅ Geração de PDF para notas fiscais
- ✅ Controle de estoque

### Sistema
- ✅ Autenticação JWT + Sessions
- ✅ Cache Redis para carrinho e sessões
- ✅ Rate limiting e segurança
- ✅ Upload de imagens
- ✅ API RESTful completa

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js 20 + Express.js
- **Banco**: PostgreSQL 16
- **Cache**: Redis 7
- **Proxy**: Nginx 1.24
- **Deploy**: PM2

## 📦 Instalação

### 1. Clone e instale dependências
```bash
git clone <repository>
cd pizzaria-rodrigos
npm install
```

### 2. Configure o ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Configure o banco PostgreSQL
```bash
# Crie o banco de dados
createdb pizzaria_rodrigos

# Execute as migrações
npm run migrate

# Popule com dados iniciais
npm run seed
```

### 4. Inicie o Redis
```bash
sudo systemctl start redis
```

### 5. Build do frontend
```bash
npm run build
```

### 6. Inicie a aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Com PM2
pm2 start ecosystem.config.js
```

## 🔧 Configuração do Servidor

### Nginx
```bash
# Copie a configuração
sudo cp nginx.conf /etc/nginx/sites-available/pizzaria-rodrigos
sudo ln -s /etc/nginx/sites-available/pizzaria-rodrigos /etc/nginx/sites-enabled/

# Teste e recarregue
sudo nginx -t
sudo systemctl reload nginx
```

### Logs
```bash
# Crie os diretórios de log
sudo mkdir -p /var/www/logs/pizzaria-rodrigos
sudo chown -R $USER:$USER /var/www/logs/pizzaria-rodrigos
```

### PM2
```bash
# Instale o PM2 globalmente
npm install -g pm2

# Inicie a aplicação
pm2 start ecosystem.config.js

# Configure para iniciar no boot
pm2 startup
pm2 save
```

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Produto específico
- `POST /api/products` - Criar produto (Owner)
- `PUT /api/products/:id` - Atualizar produto (Owner)
- `DELETE /api/products/:id` - Excluir produto (Owner)

### Pedidos
- `GET /api/orders/my-orders` - Pedidos do usuário
- `GET /api/orders` - Todos os pedidos (Owner)
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/:id/status` - Atualizar status (Owner)
- `GET /api/orders/:id/pdf` - Gerar PDF (Owner)

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas (Owner)
- `GET /api/dashboard/activity` - Atividade recente (Owner)

### Upload
- `POST /api/upload/product-image` - Upload de imagem (Owner)

## 👥 Usuários de Teste

### Cliente
- **Email**: cliente@teste.com
- **Senha**: 123456

### Proprietário
- **Email**: rodrigo@pizzaria.com
- **Senha**: admin123

## 🔒 Segurança

- Helmet.js para headers de segurança
- Rate limiting por IP
- Validação de entrada com express-validator
- Senhas hasheadas com bcrypt
- JWT para autenticação
- CORS configurado
- SQL injection protection

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🚀 Deploy

1. Configure o servidor Ubuntu 24.04 LTS
2. Instale Node.js 20, PostgreSQL 16, Redis 7, Nginx
3. Clone o repositório em `/var/www/apps/pizzaria-rodrigos/`
4. Configure as variáveis de ambiente
5. Execute migrações e seed
6. Configure Nginx como reverse proxy
7. Inicie com PM2

## 📝 Logs

Os logs são armazenados em:
- `/var/www/logs/pizzaria-rodrigos/combined.log`
- `/var/www/logs/pizzaria-rodrigos/error.log`
- `/var/www/logs/pizzaria-rodrigos/nginx-access.log`
- `/var/www/logs/pizzaria-rodrigos/nginx-error.log`

## 🔍 Monitoramento

- Health check: `GET /health`
- PM2 monitoring: `pm2 monit`
- Logs em tempo real: `pm2 logs pizzaria-rodrigos`

## 📞 Suporte

Para dúvidas ou problemas, consulte os logs ou entre em contato com a equipe de desenvolvimento.