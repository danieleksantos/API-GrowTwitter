import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' 
import 'dotenv/config' 

const SALT_ROUNDS = 10 

export async function registerUser(req: Request, res: Response): Promise<Response> {
    const { name, username, password, imageUrl } = req.body

    if (!name || !username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Os campos obrigatórios são: name, username e password.',
        })
    }

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'O nome de usuário já está em uso. Por favor, escolha outro.',
            })
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const newUser = await prismaClient.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                ...(imageUrl && { imageUrl }),
            },
            select: {
                id: true,
                name: true,
                username: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Registro concluído com sucesso.',
            data: newUser,
        })
    } catch (error) {
        console.error('Erro no registro de usuário:', error)
        
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao tentar registrar o usuário.',
        })
    }
}

export async function loginUser(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username e password são obrigatórios.',
        })
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: { username },
        })

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciais inválidas.',
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciais inválidas.',
            })
        }
        
        const jwtSecret = process.env.JWT_SECRET
        
        if (!jwtSecret) {
            console.error("JWT_SECRET não configurado em .env")
            return res.status(500).json({ message: "Erro de configuração do servidor." })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            jwtSecret,
            { expiresIn: '7d' } 
        )

        const userResponse = {
            id: user.id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        return res.status(200).json({
            success: true,
            message: 'Login bem-sucedido.',
            token, 
            user: userResponse,
        })
    } catch (error) {
        console.error('Erro no login de usuário:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao tentar fazer login.',
        })
    }
}