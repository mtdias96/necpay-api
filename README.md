<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# NecPay API

Sistema completo de gestão para adegas e estabelecimentos vinícolas. API REST desenvolvida com arquitetura limpa (Clean Architecture), oferecendo funcionalidades completas de autenticação, gerenciamento de produtos, categorias, pedidos e relatórios de vendas.

---

## 🚀 Descrição
A NecPay API é uma solução robusta para gestão completa de adegas, oferecendo:
- **Autenticação segura** com AWS Cognito
- **Gestão completa de produtos** com controle de estoque
- **Sistema de categorização** para organização de produtos
- **Processamento de pedidos** com cálculos automáticos
- **Relatórios de vendas** por período
- **Arquitetura serverless** escalável e moderna

---

## 🛠️ Stack Tecnológico

### Backend & Infraestrutura
- **Node.js 22** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Serverless Framework v4** - Deploy e gerenciamento AWS
- **AWS Lambda** - Computação serverless
- **API Gateway** - Roteamento HTTP
- **AWS Cognito** - Autenticação e autorização
- **AWS S3** - Armazenamento de imagens de produtos

### Banco de Dados
- **PostgreSQL (Neon)** - Banco de dados principal
- **Drizzle ORM** - Object-Relational Mapping
- **Migrations automáticas** - Controle de versão do schema

### Arquitetura & Qualidade
- **Clean Architecture** - Separação clara de responsabilidades
- **Dependency Injection** - Container DI customizado
- **React Email** - Templates de email responsivos
- **Zod** - Validação de dados
- **ESLint + TypeScript** - Qualidade e padronização de código

---

## 📦 Instalação e Uso Local
1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd adegaTech-api
   ```
2. **Instale as dependências:**
   ```bash
   pnpm install
   ```
3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` com as variáveis abaixo (veja seção de variáveis).
4. **Rode localmente:**
   ```bash
   serverless dev
   ```

---

## ☁️ Deploy
O deploy é feito via Serverless Framework para AWS Lambda:
```bash
serverless deploy
```

---

## ⚙️ Variáveis de Ambiente
Configure as seguintes variáveis no `.env`:
- `DATABASE_URL` – URL de conexão do PostgreSQL
- `COGNITO_CLIENT_ID` – Client ID do Cognito
- `COGNITO_POOL_ID` – Pool ID do Cognito
- `COGNITO_CLIENT_SECRET` – Client Secret do Cognito

---

## 🏗️ Arquitetura Clean Architecture

### Estrutura de Pastas
```
src/
├── application/        # Camada de Aplicação
│   ├── controllers/    # Controllers HTTP (Auth, Product, Category, Order, Reports)
│   ├── usecases/       # Casos de uso de negócio
│   ├── entities/       # Entidades de domínio
│   ├── errors/         # Tratamento de erros customizados
│   ├── query/          # Objetos de consulta/filtros
│   └── services/       # Serviços de domínio
├── infra/              # Camada de Infraestrutura
│   ├── database/       # Repositórios e schema Drizzle
│   ├── clients/        # Clientes AWS (Cognito, S3)
│   └── emails/         # Templates React Email
├── main/               # Camada Principal
│   └── functions/      # Handlers AWS Lambda
├── kernel/             # Núcleo do Framework
│   └── di/             # Container de Injeção de Dependência
└── shared/             # Utilitários Compartilhados
sls/                    # Configurações Serverless Framework
```

### Camadas da Arquitetura
- **Application**: Regras de negócio e casos de uso
- **Infrastructure**: Implementações técnicas (banco, APIs externas)
- **Main**: Pontos de entrada (Lambda handlers)
- **Kernel**: Framework customizado (DI, decorators)

---

## 🌐 API Endpoints

### 🔐 Autenticação
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/sign-up` | Cadastro de proprietário e adega | ❌ |
| POST | `/auth/sign-in` | Login do usuário | ❌ |
| POST | `/auth/refresh-token` | Renovar token de acesso | ❌ |
| POST | `/auth/forgot-password` | Solicitar recuperação de senha | ❌ |
| POST | `/auth/forgot-password/confirm` | Confirmar nova senha | ❌ |

### 🍷 Produtos
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/product` | Criar novo produto | ✅ |
| GET | `/products` | Listar produtos (com filtros) | ✅ |
| GET | `/products/{productId}` | Obter produto por ID | ✅ |
| PUT | `/product/{productId}` | Atualizar produto | ✅ |
| DELETE | `/product/{productId}` | Deletar produto | ✅ |

### 📂 Categorias
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/category` | Criar nova categoria | ✅ |
| GET | `/category` | Listar categorias | ✅ |
| GET | `/category/{categoryId}` | Obter categoria por ID | ✅ |
| PUT | `/category/{categoryId}` | Atualizar categoria | ✅ |
| DELETE | `/category/{categoryId}` | Deletar categoria | ✅ |

### 🛒 Pedidos
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/orders` | Processar novo pedido | ✅ |

### 📊 Relatórios
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/report/sales` | Relatórios de vendas por período | ✅ |

---

## 🗄️ Modelo de Dados

### Entidades Principais
- **Account** - Conta do proprietário (id, name, email, externalId, createdAt, updatedAt)
- **Store** - Estabelecimento/adega (id, name, email, phone, accountId, createdAt)
- **Product** - Produtos (id, name, description, price, stock, categoryId, imageUrl, storeId)
- **Category** - Categorias de produtos (id, name, description, storeId)
- **Order** - Pedidos (id, totalAmount, paymentMethod, storeId, createdAt)
- **OrderItem** - Itens do pedido (id, orderId, productId, quantity, unitPrice, totalPrice)
- **StockMovement** - Movimentações de estoque (id, productId, type, quantity, reason)

---

## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Cadastro de proprietários com criação automática da adega
- Login seguro com JWT tokens
- Recuperação de senha via email
- Refresh tokens para renovação automática
- Triggers Cognito customizados para templates de email

### 🍷 Gestão de Produtos
- CRUD completo de produtos
- Upload de imagens para AWS S3
- Controle de estoque automático
- Filtros avançados de busca
- Categorização de produtos

### 📂 Sistema de Categorias
- Organização hierárquica de produtos
- CRUD completo de categorias
- Filtros por categoria

### 🛒 Processamento de Pedidos
- Criação de pedidos com múltiplos itens
- Cálculo automático de totais
- Controle automático de estoque
- Validação de disponibilidade
- Histórico de movimentações

### 📊 Relatórios e Analytics
- Relatórios de vendas por período
- Cálculo de ticket médio
- Métricas de performance
- Análise temporal de vendas

### ✉️ Sistema de Emails
- Templates React Email responsivos
- Envio via AWS SES
- Emails de recuperação de senha
- Triggers automáticos do Cognito

---

## 🔧 Scripts de Desenvolvimento

### Desenvolvimento
```bash
pnpm install          # Instalar dependências
serverless dev         # Servidor local de desenvolvimento
pnpm dev:email         # Dev server para templates de email
```

### Database
```bash
pnpm db:generate       # Gerar migrações Drizzle
pnpm db:push          # Aplicar migrações no banco
```

### Qualidade de Código
```bash
pnpm typecheck        # Checagem de tipos TypeScript
```

### Deploy
```bash
serverless deploy     # Deploy para AWS
```

---

## 🚀 Status do Projeto

### ✅ Funcionalidades Implementadas
- ✅ Sistema completo de autenticação
- ✅ CRUD de produtos com upload de imagens
- ✅ Sistema de categorias
- ✅ Processamento de pedidos
- ✅ Controle de estoque
- ✅ Relatórios de vendas
- ✅ Templates de email
- ✅ Clean Architecture implementada
- ✅ Dependency Injection
- ✅ Validações com Zod
- ✅ Cognito Triggers customizados

### 🔄 Em Desenvolvimento
- 🔄 Sistema de funcionários/employees
- 🔄 Relatórios avançados
- 🔄 Dashboard analytics

---

## 🏆 Arquitetura Diferencial

### Clean Architecture
- Separação clara de responsabilidades
- Baixo acoplamento entre camadas
- Testabilidade e manutenibilidade

### Dependency Injection
- Container DI customizado
- Decorators `@Injectable()` 
- Resolução automática de dependências

### Serverless First
- Escalabilidade automática
- Pay-per-use
- Zero gerenciamento de servidor

### Type Safety
- TypeScript em todo o codebase
- Validação runtime com Zod
- Schemas tipados do banco com Drizzle

---

## 📄 Licença
ISC

---

## 📬 Contato
Para dúvidas, sugestões ou suporte técnico, entre em contato através dos canais oficiais da NecPay.
