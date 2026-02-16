<h1 align="center">Growtwitter API 🐦</h1>
<p align="center"><strong>API RESTful robusta e escalável, desenvolvida com Clean Code e Arquitetura em Camadas (Service Pattern).</strong></p>
<p align="center">Com suporte a Feed Global, Trends, Paginação, Sistema de Follow e Validação de Dados rigorosa.</p>

<p align="center">
  🚀 <strong>Acesse o projeto online:</strong><br>
  <a href="https://grow-twitter.vercel.app/" target="_blank">https://grow-twitter.vercel.app/</a>
</p>

<p align="center">
  💻 <strong>Repositório Frontend:</strong> 
  <a href="https://github.com/danieleksantos/grow-twitter" target="_blank">github.com/danieleksantos/grow-twitter</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
</p>

<hr />

<h2>Tecnologias e Arquitetura</h2>
<ul>
  <li><strong>Node.js & Express</strong></li>
  <li><strong>TypeScript</strong></li>
  <li><strong>Prisma ORM</strong></li>
  <li><strong>PostgreSQL (Neon DB)</strong></li>
  <li><strong>Zod</strong> (Validação e DTOs)</li>
  <li><strong>Service Layer Pattern</strong> (Arquitetura em Camadas)</li>
  <li><strong>JWT</strong> & <strong>bcrypt</strong> (Autenticação)</li>
</ul>

<h2>Configuração e Instalação</h2>
<p>Siga os passos abaixo para rodar o projeto localmente.</p>

<h3>1. Clonar o repositório</h3>
<pre>
<code>git clone [URL_DO_SEU_REPOSITORIO_API]
cd growtwitter-api
npm install
</code>
</pre>

<h3>2. Configurar <code>.env</code></h3>
<pre>
<code>DATABASE_URL="postgresql://[USUARIO]:[SENHA]@[HOST]/[BANCO]?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura"
PORT=3000
</code>
</pre>

<h3>3. Rodar migrações</h3>
<pre>
<code>npx prisma migrate dev --name init_db</code>
</pre>

<h3>4. Iniciar servidor</h3>
<pre>
<code>npm run dev</code>
</pre>
<p>Servidor disponível em <code>http://localhost:3000</code>.</p>

<hr />

<h2>Autenticação (JWT)</h2>
<p>Rotas protegidas exigem o header:</p>
<pre>
<code>Authorization: Bearer SEU_TOKEN_AQUI</code>
</pre>

<h3>Rotas de Autenticação</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>POST</td><td>/auth/register</td><td>Cria um novo usuário</td><td>Não</td></tr>
  <tr><td>POST</td><td>/auth/login</td><td>Autentica e retorna Token</td><td>Não</td></tr>
</table>

<hr />

<h2>Rotas da API</h2>

<h3>Usuários (/users)</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>GET</td><td>/users?page=1</td><td>Lista todos os usuários (Explorar)</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/users/:username</td><td>Dados do perfil e contadores</td><td>Sim</td></tr>
  <tr><td>PUT</td><td>/users</td><td>Atualiza nome e avatar do usuário logado</td><td>Sim</td></tr>
  <tr><td>POST</td><td>/users/:id/follow</td><td>Seguir usuário</td><td>Sim</td></tr>
  <tr><td>DELETE</td><td>/users/:id/follow</td><td>Deixar de seguir</td><td>Sim</td></tr>
</table>

<h3>Tweets (/tweets)</h3>
<p>A rota de listagem se adapta conforme os parâmetros (Query Params) enviados.</p>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Query Params</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>POST</td><td>/tweets</td><td>-</td><td>Criar novo tweet</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/tweets</td><td><code>page=1</code></td><td><strong>Feed Padrão:</strong> Tweets de quem você segue</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/tweets</td><td><code>type=global</code></td><td><strong>Trends:</strong> Tweets de toda a rede</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/tweets</td><td><code>username=diego</code></td><td><strong>Perfil:</strong> Tweets de um usuário específico</td><td>Sim</td></tr>
  <tr><td>DELETE</td><td>/tweets/:id</td><td>-</td><td>Deletar tweet (apenas autor)</td><td>Sim</td></tr>
</table>

<h3>Likes e Comentários</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>POST</td><td>/tweets/:id/like</td><td>Curtir tweet</td><td>Sim</td></tr>
  <tr><td>DELETE</td><td>/tweets/:id/like</td><td>Remover like</td><td>Sim</td></tr>
  <tr><td>POST</td><td>/tweets/:id/comments</td><td>Criar comentário</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/tweets/:id/comments</td><td>Listar comentários</td><td>Não</td></tr>
</table>

<hr />
<p align="center">Desenvolvido com 💙 no desafio Growtwitter 🚀</p>
