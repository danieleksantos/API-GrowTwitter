  Growtwitter API — README  :root{--bg:#0f1724;--card:#0b1220;--text:#e6eef8;--muted:#9fb0c8;--accent:#60a5fa} html,body{height:100%;margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial} body{background:linear-gradient(180deg,#071028 0%, #081923 100%);color:var(--text);line-height:1.5} .readme{max-width:900px;margin:48px auto;padding:28px;background:rgba(255,255,255,0.02);border-radius:12px;box-shadow:0 6px 30px rgba(2,6,23,0.6)} .readme\_\_header{display:flex;align-items:center;gap:16px} .readme\_\_title{font-size:1.6rem;margin:0} .readme\_\_badge{font-size:0.8rem;color:var(--muted);padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.02)} .readme\_\_section{margin-top:20px} h2{margin:18px 0 8px;font-size:1.1rem} p{margin:8px 0;color:var(--muted)} ul{margin:8px 0 8px 20px} pre{background:#021024;padding:12px;border-radius:8px;overflow:auto} code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Roboto Mono,monospace;color:var(--text)} table{width:100%;border-collapse:collapse;margin-top:8px} th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,0.03);text-align:left} .readme\_\_note{background:rgba(96,165,250,0.08);padding:10px;border-left:4px solid var(--accent);color:var(--text);border-radius:6px} a{color:var(--accent)} /\* BEM-style example classes \*/ .readme\_\_code-block--bash{font-size:0.95rem} @media (max-width:600px){.readme{margin:16px;padding:16px}} [Ir para o conteúdo](#main)

Growtwitter API
===============

API RESTful • Node • TypeScript • Prisma • PostgreSQL

Tecnologias Utilizadas
----------------------

*   **Node.js & Express** — Ambiente de execução e framework para o servidor
*   **TypeScript** — Tipagem estática e segurança
*   **Prisma ORM** — ORM moderno para interação com o banco
*   **PostgreSQL (Neon DB)** — Banco relacional de alta performance
*   **JWT (JSON Web Tokens)** — Autenticação e segurança
*   **bcrypt** — Hash seguro de senhas

Configuração e Instalação
-------------------------

Siga os passos abaixo para configurar o projeto na sua máquina local.

### 1\. Clonar o repositório e instalar dependências

    git clone [URL_DO_SEU_REPOSITORIO]
    cd growtwitter-api
    npm install

### 2\. Arquivo `.env` (configuração do banco)

Crie um arquivo chamado `.env` na raiz do projeto e adicione:

    DATABASE_URL="postgresql://[USUARIO]:[SENHA]@[HOST]/[BANCO_DE_DADOS]?schema=public"
    JWT_SECRET="sua_chave_secreta_aqui"

### 3\. Executar migrações do Prisma

    npx prisma migrate dev --name init_db

### 4\. Iniciar o servidor

    npm run dev

O servidor ficará disponível em [http://localhost:3000](http://localhost:3000).

Autenticação (JWT)
------------------

Rotas protegidas exigem o token no cabeçalho `Authorization` no formato:

    Authorization: Bearer [SEU_TOKEN_AQUI]

### Rotas de autenticação

Método

Endpoint

Descrição

Auth

POST

/auth/register

Cria um novo usuário

Não

POST

/auth/login

Autentica o usuário e retorna JWT

Não

Documentação das Rotas da API
-----------------------------

### Rotas de Usuários e Seguidores (`/users`)

Método

Endpoint

Descrição

Auth

GET

/users

Lista todos os usuários (Descobrir)

Não

GET

/users/:username

Busca o perfil do usuário, incluindo tweets e contagens

Sim

POST

/users/:followingId/follow

Seguir um usuário

Sim

DELETE

/users/:followingId/follow

Deixar de seguir um usuário

Sim

### Rotas de Tweets e Feed (`/tweets`)

Método

Endpoint

Descrição

Auth

POST

/tweets

Cria um novo tweet

Sim

GET

/tweets

Feed personalizado (usuário + quem segue)

Sim

DELETE

/tweets/:tweetId

Deleta um tweet (apenas autor)

Sim

### Rotas de Likes (`/tweets/:tweetId/like`)

Método

Endpoint

Descrição

Auth

POST

/tweets/:tweetId/like

Curte um tweet

Sim

DELETE

/tweets/:tweetId/like

Remove a curtida

Sim

### Rotas de Comentários (`/tweets/:tweetId/comments`)

Método

Endpoint

Descrição

Auth

POST

/tweets/:tweetId/comments

Cria um comentário no tweet

Sim

GET

/tweets/:tweetId/comments

Lista comentários do tweet

Não

Extras e sugestões
------------------

Posso adicionar exemplos de requisições (curl / Postman), fluxos de autenticação ilustrados, badges, instruções para rodar com Docker, ou uma seção com _deployment_. Diga qual você prefere.

Gerado automaticamente — Growtwitter API • README
