openapi: 3.0.0
info:
  title: Growtwitter API 🐦
  version: 1.0.0
  description: API do clone do Twitter com autenticação JWT e PostgreSQL.
servers:
  - url: http://localhost:3000
    description: Servidor Local
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        username: { type: string }
        imageUrl: { type: string }
        createdAt: { type: string, format: date-time }
    Tweet:
      type: object
      properties:
        id: { type: string, format: uuid }
        content: { type: string, maxLength: 280 }
        userId: { type: string }
        createdAt: { type: string, format: date-time }
    Comment:
      type: object
      properties:
        id: { type: string, format: uuid }
        content: { type: string, maxLength: 280 }
        userId: { type: string }
        tweetId: { type: string }
        createdAt: { type: string, format: date-time }
    Error:
      type: object
      properties:
        success: { type: boolean, example: false }
        message: { type: string }