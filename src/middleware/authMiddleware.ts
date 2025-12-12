import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

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

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acesso negado. Token não fornecido.',
        })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
        return res.status(401).json({
            success: false,
            message: 'Erro no token. Formato esperado: Bearer <token>',
        })
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            success: false,
            message: 'Token malformado. O esquema deve ser Bearer.',
        })
    }

    try {
        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
            console.error("ERRO CRÍTICO: JWT_SECRET não configurado.")
            return res.status(500).json({ message: "Erro de configuração do servidor." })
        }
        
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload

        req.user = decoded 

        return next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado.',
        })
    }
}