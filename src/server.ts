import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.routes.js' 
import { usersRouter } from './routes/users.routes.js' 
import { tweetsRouter } from './routes/tweets.routes.js' 

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',              
    'https://grow-twitter.vercel.app'    
  ],
  credentials: true 
}))

app.use(express.json())

app.use('/auth', authRoutes) 
app.use('/users', usersRouter) 
app.use('/tweets', tweetsRouter)

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Growtwitter API no ar!',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})