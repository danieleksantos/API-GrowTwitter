paths:
  /tweets:
    post:
      summary: Criar um novo tweet
      tags: [Tweets]
      security: [{ bearerAuth: [] }]
      requestBody:
        content:
          application/json:
            schema:
              properties:
                content: { type: string, example: "Olá mundo! #Growdev" }
      responses:
        201:
          description: Criado com sucesso
        401:
          description: Não autenticado

    get:
      summary: Listar tweets com filtros e paginação
      tags: [Tweets]
      parameters:
        - in: query
          name: page
          schema: { type: integer, default: 1 }
        - in: query
          name: type
          schema: { type: string, enum: [global] }
        - in: query
          name: username
          schema: { type: string }
      responses:
        200:
          description: Lista retornada
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: 
                    type: array
                    items: { $ref: '#/components/schemas/Tweet' }
                  meta:
                    type: object
                    properties:
                      total: { type: integer }
                      page: { type: integer }

  /tweets/{tweetId}:
    delete:
      summary: Deletar um tweet próprio
      tags: [Tweets]
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: tweetId
          required: true
          schema: { type: string }
      responses:
        200:
          description: Deletado com sucesso
        403:
          description: Proibido (não é o dono)