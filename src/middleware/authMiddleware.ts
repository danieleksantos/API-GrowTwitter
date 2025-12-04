import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

interface JwtPayload {
    id: string;
    username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}


export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acesso negado. Token não fornecido.',
        })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Formato de token inválido.',
        })
    }

    try {
        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
            console.error("JWT_SECRET não configurado em .env")
            return res.status(500).json({ message: "Erro de configuração do servidor." })
        }
        
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload

        req.user = decoded 

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado.',
        })
    }
}