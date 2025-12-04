# Growtwitter API

Uma **API RESTful completa**, inspirada nas funcionalidades principais do Tweeter, incluindo autenticação, tweets, sistema de seguidores, likes e comentários.

---

## 🚀 Tecnologias Utilizadas

- **Node.js & Express** — Ambiente de execução e framework para o servidor  
- **TypeScript** — Tipagem estática e segurança  
- **Prisma ORM** — ORM moderno para interação com o banco  
- **PostgreSQL (Neon DB)** — Banco relacional de alta performance  
- **JWT (JSON Web Tokens)** — Autenticação e segurança  
- **bcrypt** — Hash seguro de senhas  

---

## ⚙️ Configuração e Instalação

Siga os passos abaixo para configurar o projeto na sua máquina local.

### 1. Clonar o Repositório e Instalar Dependências

```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd growtwitter-api
npm install

🗄️ Configuração do Banco de Dados (.env)

Crie um arquivo chamado .env na raiz do projeto:
```bash
# URL de conexão com seu PostgreSQL (ex: Neon DB)
DATABASE_URL="postgresql://[USUARIO]:[SENHA]@[HOST]/[BANCO_DE_DADOS]?schema=public"

# Chave secreta para geração do JWT  
JWT_SECRET="sua_chave_secreta_aqui"

🧩 Executar as Migrações do Prisma

Aplique todas as migrações (User, Tweet, Follows, Like, Comment):
```bash
npx prisma migrate dev --name init_db

▶️ Iniciar o Servidor
```bash
npm run dev

O servidor estará rodando em:
👉 http://localhost:3000

🔐 Autenticação (JWT)

Rotas marcadas com "Sim" exigem envio do token via cabeçalho:
```bash
Authorization: Bearer [SEU_TOKEN_AQUI]

| Método | Endpoint       | Descrição                      | Auth |
| ------ | -------------- | ------------------------------ | ---- |
| POST   | /auth/register | Cria um novo usuário           | Não  |
| POST   | /auth/login    | Autentica o usuário e gera JWT | Não  |

📚 Documentação das Rotas da API
👤 Rotas de Usuários e Seguidores (/users)
| Método | Endpoint                   | Descrição                           | Auth |
| ------ | -------------------------- | ----------------------------------- | ---- |
| GET    | /users                     | Lista todos os usuários (Descobrir) | Não  |
| GET    | /users/:username           | Perfil + tweets + contagens         | Sim  |
| POST   | /users/:followingId/follow | Seguir um usuário                   | Sim  |
| DELETE | /users/:followingId/follow | Deixar de seguir um usuário         | Sim  |

🐦 Rotas de Tweets e Feed (/tweets)
| Método | Endpoint         | Descrição                                 | Auth |
| ------ | ---------------- | ----------------------------------------- | ---- |
| POST   | /tweets          | Cria um novo tweet                        | Sim  |
| GET    | /tweets          | Feed personalizado (usuário + quem segue) | Sim  |
| DELETE | /tweets/:tweetId | Deleta um tweet (somente se for o autor)  | Sim  |

❤️ Rotas de Likes (/tweets/:tweetId/like)

| Método | Endpoint              | Descrição                 | Auth |
| ------ | --------------------- | ------------------------- | ---- |
| POST   | /tweets/:tweetId/like | Curte um tweet            | Sim  |
| DELETE | /tweets/:tweetId/like | Remove a curtida do tweet | Sim  |

💬 Rotas de Comentários (/tweets/:tweetId/comments)
| Método | Endpoint                  | Descrição                           | Auth |
| ------ | ------------------------- | ----------------------------------- | ---- |
| POST   | /tweets/:tweetId/comments | Cria um novo comentário             | Sim  |
| GET    | /tweets/:tweetId/comments | Lista todos os comentários do tweet | Não  |





