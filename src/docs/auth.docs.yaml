paths:
  /auth/register:
    post:
      summary: Criar uma nova conta
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, username, password]
              properties:
                name: { type: string, example: "Daniele Santos" }
                username: { type: string, example: "daniele_dev" }
                password: { type: string, example: "senha123" }
      responses:
        201:
          description: Registro concluído
        409:
          description: Usuário já existe
        400:
          description: Erro de validação (Zod)

  /auth/login:
    post:
      summary: Realizar login
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username: { type: string }
                password: { type: string }
      responses:
        200:
          description: Login bem-sucedido
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  token: { type: string }
                  user: { $ref: '#/components/schemas/User' }
        401:
          description: Credenciais inválidas