paths:
  /users:
    get:
      summary: Listar usuários cadastrados
      tags: [Users]
      parameters:
        - in: query
          name: page
          schema: { type: integer }
      responses:
        200:
          description: Lista de usuários
  /users/{username}:
    get:
      summary: Obter perfil de um usuário
      tags: [Users]
      parameters:
        - in: path
          name: username
          required: true
          schema: { type: string }
      responses:
        200:
          description: Dados do perfil
  /users/{followingId}/follow:
    post:
      summary: Seguir um usuário
      tags: [Users]
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: followingId
          required: true
          schema: { type: string }
      responses:
        201:
          description: Seguindo
    delete:
      summary: Deixar de seguir
      tags: [Users]
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: followingId
          required: true
          schema: { type: string }
      responses:
        200:
          description: Unfollowed