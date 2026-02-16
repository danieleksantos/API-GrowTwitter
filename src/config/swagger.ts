import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Growtwitter API 🐦',
      version: '1.0.0',
      description: 'API RESTful robusta e escalável desenvolvida com Clean Code e Service Pattern.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // O caminho deve apontar para onde seus arquivos YAML estão
  apis: ['./src/docs/*.yaml'], 
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);