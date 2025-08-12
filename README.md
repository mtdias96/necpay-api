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

# AdegaTech API

API para gestão de adegas, focada em autenticação, onboarding e estruturação inicial para controle de produtos, vendas e relatórios. Desenvolvida em Node.js, Serverless e AWS, com autenticação via Cognito e banco de dados PostgreSQL.

---

## 🚀 Descrição
A Vexy API é o backend de um sistema para gestão de estabelecimentos, permitindo cadastro de proprietários, onboarding de estabelecimentos, autenticação segura, e servindo de base para módulos de produtos, vendas, relatórios e financeiro.

---

## 🛠️ Tecnologias Utilizadas
- Node.js 22
- TypeScript
- Serverless Framework
- AWS Lambda & API Gateway
- AWS Cognito (autenticação)
- PostgreSQL (Neon)
- Drizzle ORM
- React Email (templates de email)
- Zod (validação)

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

## 📁 Estrutura de Pastas
```
src/
  application/   # Casos de uso, controllers, entidades, erros
  infra/         # Banco, clients, emails, gateways
  main/          # Entrypoints (handlers Lambda)
  shared/        # Configurações, tipos, sagas
  kernel/        # Injeção de dependência, decorators
sls/             # Configurações serverless
```

---

## 🔑 Endpoints de Autenticação
- **POST /sign-up** – Cadastro de proprietário e adega
- **POST /sign-in** – Login
- **POST /forgot-password** – Solicitar recuperação de senha
- **POST /confirm-forgot-password** – Confirmar recuperação de senha
- **POST /refresh-token** – Renovar token de acesso

**Todos os endpoints aceitam e retornam JSON.**

---

## 🗄️ Entidades Principais
- **Account**: id, name, email, externalId, createdAt, updatedAt
- **Store**: id, name, email, phone, accountId, createdAt

---

## ✉️ Funcionalidade de Email
- Envio de email de recuperação de senha com template customizado e código de verificação.

---

## 🗺️ Roadmap do Projeto

### 1. 🚀 Cadastro e Onboarding Inicial
- [x] Cadastro de proprietário com e-mail e senha
- [x] Onboarding solicitando nome da adega
- [x] Criação automática do registro da adega

### 2. 📦 Cadastro de Produtos e Categorias
- [ ] Cadastro de categorias (nome, ícone/imagem)
- [ ] Cadastro de produtos (nome, estoque, preço de venda, preço de custo, alerta de estoque mínimo, categoria, imagem)
- [ ] CRUD completo de categorias
- [ ] CRUD completo de produtos

### 3. 🛒 Fluxo de Venda
- [ ] Login de funcionário (modo venda)
- [ ] Tela de vendas adaptada para balcão
- [ ] Busca rápida de produtos
- [ ] Adição ao carrinho
- [ ] Seleção de forma de pagamento (Pix, dinheiro, cartão, NFC)
- [ ] Confirmação/finalização da venda
- [ ] Baixa automática de estoque
- [ ] Registro da venda (data/hora, valor, produtos, funcionário, método de pagamento)
- [ ] Atualização dos dados financeiros

### 4. 📊 Painel do Dono
- [ ] Relatórios de vendas (período, produtos mais vendidos, horários de pico)
- [ ] Controle de estoque (atualização automática, alertas, reajuste manual)
- [ ] Gestão de funcionários (adicionar, editar, remover, visualizar desempenho) *(Não essencial)*
- [ ] Gestão de produtos e categorias (CRUD, filtros, buscas)
- [ ] Financeiro (receita total/por período, lucro estimado) *(Lucro não essencial)*
- [ ] Exportação de relatórios em PDF *(Não essencial)*
- [ ] Configurações (editar perfil/adega, mudar senha/e-mail, encerrar conta)

### 5. 👥 Cadastro e Gestão de Funcionários *(REMOVIDO DO MVP)*
- [ ] Cadastro de colaboradores (nome, e-mail, função)
- [ ] Permissões restritas para funcionários

---

## 📜 Scripts Úteis
- `pnpm typecheck` – Checagem de tipos TypeScript
- `pnpm db:generate` – Gera migrações Drizzle
- `pnpm db:push` – Aplica migrações no banco
- `pnpm dev:email` – Dev server para templates de email

---

## 📄 Licença
ISC

---

## 📬 Contato
Dúvidas, sugestões ou problemas? Envie um email para suporte@adegatech.com
