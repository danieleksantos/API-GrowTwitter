paths:
  /tweets/{tweetId}/comments:
    post:
      summary: Comentar em um tweet
      description: Adiciona um novo comentário a um tweet existente. Requer validação de conteúdo.
      tags: [Comments]
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: tweetId
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [content]
              properties:
                content:
                  type: string
                  maxLength: 280
                  example: "Excelente tweet! Concordo plenamente."
      responses:
        201:
          description: Comentário criado com sucesso!
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  data: { $ref: '#/components/schemas/Comment' }
        400:
          description: Erro de validação no conteúdo (Zod).
        404:
          description: Tweet pai não encontrado.

    get:
      summary: Listar comentários de um tweet
      tags: [Comments]
      parameters:
        - in: path
          name: tweetId
          required: true
          schema:
            type: string
            format: uuid
      responses:
        200:
          description: Lista de comentários retornada.
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/Comment' }