<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Growtwitter API — README</title>
  <meta name="description" content="Documentação e instruções para executar a Growtwitter API (Node, TypeScript, Prisma, PostgreSQL)">
  <style>
    :root{--bg:#0f1724;--card:#0b1220;--text:#e6eef8;--muted:#9fb0c8;--accent:#60a5fa}
    html,body{height:100%;margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial}
    body{background:linear-gradient(180deg,#071028 0%, #081923 100%);color:var(--text);line-height:1.5}
    .readme{max-width:900px;margin:48px auto;padding:28px;background:rgba(255,255,255,0.02);border-radius:12px;box-shadow:0 6px 30px rgba(2,6,23,0.6)}
    .readme__header{display:flex;align-items:center;gap:16px}
    .readme__title{font-size:1.6rem;margin:0}
    .readme__badge{font-size:0.8rem;color:var(--muted);padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.02)}
    .readme__section{margin-top:20px}
    h2{margin:18px 0 8px;font-size:1.1rem}
    p{margin:8px 0;color:var(--muted)}
    ul{margin:8px 0 8px 20px}
    pre{background:#021024;padding:12px;border-radius:8px;overflow:auto}
    code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Roboto Mono,monospace;color:var(--text)}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,0.03);text-align:left}
    .readme__note{background:rgba(96,165,250,0.08);padding:10px;border-left:4px solid var(--accent);color:var(--text);border-radius:6px}
    a{color:var(--accent)}
    /* BEM-style example classes */
    .readme__code-block--bash{font-size:0.95rem}
    @media (max-width:600px){.readme{margin:16px;padding:16px}}
  </style>
</head>
<body>
  <a class="skip-link" href="#main">Ir para o conteúdo</a>
  <main id="main" class="readme" role="main" aria-labelledby="title">
    <header class="readme__header">
      <div>
        <h1 id="title" class="readme__title">Growtwitter API</h1>
        <div class="readme__badge">API RESTful • Node • TypeScript • Prisma • PostgreSQL</div>
      </div>
    </header>

    <section class="readme__section" aria-labelledby="tech">
      <h2 id="tech">Tecnologias Utilizadas</h2>
      <ul>
        <li><strong>Node.js &amp; Express</strong> — Ambiente de execução e framework para o servidor</li>
        <li><strong>TypeScript</strong> — Tipagem estática e segurança</li>
        <li><strong>Prisma ORM</strong> — ORM moderno para interação com o banco</li>
        <li><strong>PostgreSQL (Neon DB)</strong> — Banco relacional de alta performance</li>
        <li><strong>JWT (JSON Web Tokens)</strong> — Autenticação e segurança</li>
        <li><strong>bcrypt</strong> — Hash seguro de senhas</li>
      </ul>
    </section>

    <section class="readme__section" aria-labelledby="install">
      <h2 id="install">Configuração e Instalação</h2>
      <p>Siga os passos abaixo para configurar o projeto na sua máquina local.</p>

      <h3>1. Clonar o repositório e instalar dependências</h3>
      <pre class="readme__code-block--bash" aria-label="Exemplo de comandos bash"><code>git clone [URL_DO_SEU_REPOSITORIO]
cd growtwitter-api
npm install</code></pre>

      <h3>2. Arquivo <code>.env</code> (configuração do banco)</h3>
      <p>Crie um arquivo chamado <code>.env</code> na raiz do projeto e adicione:</p>
      <pre aria-label="Exemplo de variáveis de ambiente"><code>DATABASE_URL="postgresql://[USUARIO]:[SENHA]@[HOST]/[BANCO_DE_DADOS]?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"</code></pre>

      <h3>3. Executar migrações do Prisma</h3>
      <pre aria-label="Comando para migrar o banco"><code>npx prisma migrate dev --name init_db</code></pre>

      <h3>4. Iniciar o servidor</h3>
      <pre aria-label="Comando para iniciar o servidor"><code>npm run dev</code></pre>
      <p>O servidor ficará disponível em <a href="http://localhost:3000">http://localhost:3000</a>.</p>

    </section>

    <section class="readme__section" aria-labelledby="auth">
      <h2 id="auth">Autenticação (JWT)</h2>
      <p>Rotas protegidas exigem o token no cabeçalho <code>Authorization</code> no formato:</p>
      <pre aria-label="Exemplo de header"><code>Authorization: Bearer [SEU_TOKEN_AQUI]</code></pre>

      <h3>Rotas de autenticação</h3>
      <table>
        <thead>
          <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td>POST</td><td>/auth/register</td><td>Cria um novo usuário</td><td>Não</td></tr>
          <tr><td>POST</td><td>/auth/login</td><td>Autentica o usuário e retorna JWT</td><td>Não</td></tr>
        </tbody>
      </table>
    </section>

    <section class="readme__section" aria-labelledby="routes">
      <h2 id="routes">Documentação das Rotas da API</h2>

      <h3 id="users">Rotas de Usuários e Seguidores (<code>/users</code>)</h3>
      <table>
        <thead>
          <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td>GET</td><td>/users</td><td>Lista todos os usuários (Descobrir)</td><td>Não</td></tr>
          <tr><td>GET</td><td>/users/:username</td><td>Busca o perfil do usuário, incluindo tweets e contagens</td><td>Sim</td></tr>
          <tr><td>POST</td><td>/users/:followingId/follow</td><td>Seguir um usuário</td><td>Sim</td></tr>
          <tr><td>DELETE</td><td>/users/:followingId/follow</td><td>Deixar de seguir um usuário</td><td>Sim</td></tr>
        </tbody>
      </table>

      <h3 id="tweets">Rotas de Tweets e Feed (<code>/tweets</code>)</h3>
      <table>
        <thead>
          <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td>POST</td><td>/tweets</td><td>Cria um novo tweet</td><td>Sim</td></tr>
          <tr><td>GET</td><td>/tweets</td><td>Feed personalizado (usuário + quem segue)</td><td>Sim</td></tr>
          <tr><td>DELETE</td><td>/tweets/:tweetId</td><td>Deleta um tweet (apenas autor)</td><td>Sim</td></tr>
        </tbody>
      </table>

      <h3 id="likes">Rotas de Likes (<code>/tweets/:tweetId/like</code>)</h3>
      <table>
        <thead>
          <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td>POST</td><td>/tweets/:tweetId/like</td><td>Curte um tweet</td><td>Sim</td></tr>
          <tr><td>DELETE</td><td>/tweets/:tweetId/like</td><td>Remove a curtida</td><td>Sim</td></tr>
        </tbody>
      </table>

      <h3 id="comments">Rotas de Comentários (<code>/tweets/:tweetId/comments</code>)</h3>
      <table>
        <thead>
          <tr><th>Método</th><th>Endpoint</th><th>Descrição</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td>POST</td><td>/tweets/:tweetId/comments</td><td>Cria um comentário no tweet</td><td>Sim</td></tr>
          <tr><td>GET</td><td>/tweets/:tweetId/comments</td><td>Lista comentários do tweet</td><td>Não</td></tr>
        </tbody>
      </table>

    </section>

    <section class="readme__section" aria-labelledby="extras">
      <h2 id="extras">Extras e sugestões</h2>
      <div class="readme__note">
        Posso adicionar exemplos de requisições (curl / Postman), fluxos de autenticação ilustrados, badges, instruções para rodar com Docker, ou uma seção com <em>deployment</em>. Diga qual você prefere.
      </div>
    </section>

    <footer style="margin-top:22px;color:var(--muted);font-size:0.9rem">Gerado automaticamente — Growtwitter API • README</footer>
  </main>
</body>
</html>
