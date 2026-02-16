import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import { authRoutes } from './routes/auth.routes.js'; 
import { usersRouter } from './routes/users.routes.js'; 
import { tweetsRouter } from './routes/tweets.routes.js'; 

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',              
    'https://grow-twitter.vercel.app'    
  ],
  credentials: true 
}));

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes); 
app.use('/users', usersRouter); 
app.use('/tweets', tweetsRouter);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Growtwitter API no ar! Acesse /docs para a documentação.',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📑 Documentação disponível em http://localhost:${PORT}/docs`);
});