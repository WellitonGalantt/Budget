# 💰 Budget Manager API

Uma API robusta para gerenciamento de orçamentos, desenvolvida com foco em segurança, escalabilidade e produtividade. O sistema permite o controle completo de clientes, perfis empresariais e a criação detalhada de orçamentos com múltiplos itens.

---

### 🚀 Tecnologias e Práticas

* **Node.js & Express:** Core da aplicação.
* **TypeScript:** Tipagem estática para maior segurança e autocompletação.
* **Zod:** Validação rigorosa de esquemas e tipos (Data Transfer Objects).
* **JWT & HttpOnly Cookies:** Autenticação segura que mitiga ataques de XSS ao não expor o token ao JavaScript do front-end.
* **Bcrypt:** Hashing de senhas para segurança de dados sensíveis.
* **Async Handler:** Wrapper customizado para tratamento de erros assíncronos, mantendo os controllers limpos e legíveis.
* **Arquitetura:** Camadas bem definidas (Routes -> Controllers -> Services -> Repositories).
* **Prisma:** ORM para interação com o banco de dados, facilitando a gestão de dados e consultas complexas.
* **Postman:** Ferramenta de teste e documentação de APIs.
* **PostgreSQL:** Banco de dados relacional para armazenamento de dados estruturados.

---

### 🔒 Segurança

* **Helmet:** Proteção de headers HTTP.
* **CORS:** Configurado para origens específicas via variáveis de ambiente.
* **Global Error Middleware:** Centralização de erros, incluindo tratamento especial para erros de validação do Zod (Bad Request 400).

---

### 📡 Documentação das Rotas

#### **Autenticação & Usuário**

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/user/register` | `POST` | Cria um novo usuário. |
| `/api/user/login` | `POST` | Autentica e gera o Cookie `accessToken`. |
| `/api/user/profile/:id` | `GET` | Retorna dados do usuário (Protegida). |
| `/api/user/verify` | `GET` | Verifica se o token atual é válido. |

#### **Perfil Empresarial**

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/profile/create` | `POST` | Define dados da empresa (CNPJ/CPF, Logo, etc). |
| `/api/profile/update` | `PUT` | Atualiza informações de perfil. |

#### **Clientes**

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/client/create` | `POST` | Cadastra um novo cliente. |
| `/api/client/update/:id` | `PUT` | Atualiza dados do cliente por ID. |
| `/api/client/delete/:id` | `DELETE` | Remove um cliente do sistema. |

#### **Orçamentos (Budgets)**

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/budget/create` | `POST` | Cria orçamento completo (Header + Itens). |
| `/api/budget/all` | `GET` | Lista todos os orçamentos do usuário. |
| `/api/budget/view/:id` | `GET` | Detalhes de um orçamento específico. |
| `/api/budget/item/create/:id` | `POST` | Adiciona um item a um orçamento existente. |

---

### 🛠️ Exemplo de Input (Criação de Orçamento)

Para criar um orçamento, a API espera um objeto contendo os dados principais e um array de itens:

```json
{
  "budget": {
    "client_id": "uuid-aqui",
    "title": "Reforma Escritório",
    "subtotal": 1500.00,
    "total": 1500.00
  },
  "items": [
    {
      "name": "Pintura Parede",
      "quantity": 2,
      "unit_price": 250.00,
      "line_total": 500.00
    }
  ]
}

```

---

### ⚙️ Como Rodar o Projeto

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/sua-repo.git

```


2. **Instale as dependências:**
```bash
npm install

```


3. **Configure o `.env`:**
Crie um arquivo `.env` na raiz seguindo o exemplo:
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=...
JWT_SECRET=...

```


4. **Inicie o servidor:**
```bash
npm run dev

```



---

Desenvolvido por [Welliton Galant Caetano](https://www.linkedin.com/in/wellitongalant/)
