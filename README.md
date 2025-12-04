<!-- HTML otimizado para uso dentro de README.md no GitHub -->
<!-- GitHub não permite CSS externo, classes complexas ou estilização avançada. Este HTML está simplificado e compatível com o GitHub Markdown. -->

<h1 align="center">Growtwitter API</h1>
<p align="center"><strong>API RESTful inspirada em funcionalidades principais de redes sociais</strong></p>

<hr />

<h2>Tecnologias Utilizadas</h2>
<ul>
  <li><strong>Node.js & Express</strong></li>
  <li><strong>TypeScript</strong></li>
  <li><strong>Prisma ORM</strong></li>
  <li><strong>PostgreSQL (Neon DB)</strong></li>
  <li><strong>JWT</strong></li>
  <li><strong>bcrypt</strong></li>
</ul>

<h2>Configuração e Instalação</h2>
<p>Siga os passos abaixo para rodar o projeto localmente.</p>

<h3>1. Clonar o repositório</h3>
<pre>
<code>git clone [URL_DO_SEU_REPOSITORIO]
cd growtwitter-api
npm install
</code>
</pre>

<h3>2. Configurar <code>.env</code></h3>
<pre>
<code>DATABASE_URL="postgresql://[USUARIO]:[SENHA]@[HOST]/[BANCO]?schema=public"
JWT_SECRET="sua_chave_secreta"
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
  <tr><td>POST</td><td>/auth/register</td><td>Cria usuário</td><td>Não</td></tr>
  <tr><td>POST</td><td>/auth/login</td><td>Retorna JWT</td><td>Não</td></tr>
</table>

<hr />

<h2>Rotas da API</h2>

<h3>/users</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>GET</td><td>/users</td><td>Lista usuários</td><td>Não</td></tr>
  <tr><td>GET</td><td>/users/:username</td><td>Perfil + tweets</td><td>Sim</td></tr>
  <tr><td>POST</td><td>/users/:followingId/follow</td><td>Seguir usuário</td><td>Sim</td></tr>
  <tr><td>DELETE</td><td>/users/:followingId/follow</td><td>Deixar de seguir</td><td>Sim</td></tr>
</table>

<h3>/tweets</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>POST</td><td>/tweets</td><td>Criar tweet</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/tweets</td><td>Feed personalizado</td><td>Sim</td></tr>
  <tr><td>DELETE</td><td>/tweets/:tweetId</td><td>Deletar tweet (autor)</td><td>Sim</td></tr>
</table>

<h3>/tweets/:tweetId/like</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>POST</td><td>/tweets/:tweetId/like</td><td>Curtir</td><td>Sim</td></tr>
  <tr><td>DELETE</td><td>/tweets/:tweetId/like</td><td>Remover like</td><td>Sim</td></tr>
</table>

<h3>/tweets/:tweetId/comments</h3>
<table>
  <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
  <tr><td>POST</td><td>/tweets/:tweetId/comments</td><td>Comentar</td><td>Sim</td></tr>
  <tr><td>GET</td><td>/tweets/:tweetId/comments</td><td>Listar comentários</td><td>Não</td></tr>
</table>
