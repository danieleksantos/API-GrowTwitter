paths:
  /tweets/{tweetId}/like:
    post:
      summary: Curtir um tweet
      description: Registra uma curtida do usuário autenticado para um tweet específico.
      tags: [Likes]
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: tweetId
          required: true
          schema:
            type: string
            format: uuid
          description: ID do tweet que será curtido.
      responses:
        201:
          description: Tweet curtido com sucesso!
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Tweet curtido com sucesso!" }
                  data: { $ref: '#/components/schemas/Like' }
        404:
          $ref: '#/components/responses/NotFound'
        409:
          description: Conflito - O usuário já curtiu este tweet.
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Error' }

    delete:
      summary: Remover curtida (Unlike)
      tags: [Likes]
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: tweetId
          required: true
          schema:
            type: string
            format: uuid
      responses:
        200:
          description: Curtida removida com sucesso.
        404:
          description: Curtida não encontrada.