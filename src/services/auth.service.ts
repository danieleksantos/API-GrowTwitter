import { prismaClient } from '../database/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface RegisterParams {
    name: string;
    username: string;
    password: string;
    imageUrl?: string;
}

interface LoginParams {
    username: string;
    password: string;
}

const SALT_ROUNDS = 10;

export class AuthService {
    
    async register({ name, username, password, imageUrl }: RegisterParams) {
        // 1. Verificar duplicidade
        const existingUser = await prismaClient.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        // 2. Hash da senha
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 3. Criação no Banco
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
        });

        return newUser;
    }

    async login({ username, password }: LoginParams) {
        // 1. Buscar usuário
        const user = await prismaClient.user.findUnique({
            where: { username },
        });

        // 2. Validar existência e senha (Generic Security Response)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // 3. Gerar Token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('SERVER_CONFIG_ERROR');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            jwtSecret,
            { expiresIn: '7d' }
        );

        // 4. Preparar resposta do usuário
        const userResponse = {
            id: user.id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return { token, user: userResponse };
    }
}