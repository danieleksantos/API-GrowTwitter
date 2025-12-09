import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'

// -------------------------------------------------------------------
// 1. GET USER PROFILE
// -------------------------------------------------------------------

export async function getUserProfile(req: Request, res: Response): Promise<Response> {
    const { username } = req.params
    const currentUserId = req.user?.id 

    try {
        // Passo 1: Buscar o perfil e os dados principais
        const user = await prismaClient.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                username: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                
                // Inclui as contagens
                _count: {
                    select: {
                        followers: true, 
                        following: true, 
                        tweets: true, // Contagem total de tweets
                    },
                },
                
                // Inclui tweets com informações para like/comentário
                tweets: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                id: true, username: true, name: true, imageUrl: true,
                            },
                        },
                        likes: { 
                            where: { userId: currentUserId },
                            select: { userId: true } 
                        },
                        _count: { 
                            select: { likes: true, comments: true } 
                        }
                    },
                },
            },
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.',
            })
        }
        
        // Passo 2: Checagem de Follow (Resolvendo a persistência)
        let isFollowing = false;
        
        // Só checamos se está seguindo se o usuário estiver logado e não for o próprio perfil
        if (currentUserId && user.id !== currentUserId) {
              const followRecord = await prismaClient.follows.findUnique({
                  where: {
                      followerId_followingId: {
                          followerId: currentUserId,
                          followingId: user.id, 
                      },
                  },
              });
              // Se encontrou o registro, isFollowing é true
              isFollowing = !!followRecord; 
        }

        // Passo 3: Mapeamento dos Tweets
        const mappedTweets = user.tweets.map(tweet => {
            const isLikedByMe = tweet.likes.length > 0;
            // Desestrutura os campos que não queremos expor no frontend e usa o _count
            const { likes, _count, ...restOfTweet } = tweet as any; 

            return {
                ...restOfTweet,
                isLikedByMe,
                likesCount: _count.likes,
                repliesCount: _count.comments,
                _count: undefined, // Remove o objeto _count aninhado
            }
        })
        

        // Passo 4: Construção da Resposta (⭐ AJUSTE AQUI: Inversão das Contagens de Follow)
        const responseData = {
            id: user.id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            
            // Retorna o estado de follow (true/false)
            isFollowing: user.id !== currentUserId ? isFollowing : undefined, 
            
            // ⭐ INVERSÃO: 
            // followersCount (quem segue a página) recebe o que o Prisma chama de following
            followersCount: user._count.following, 
            // followingCount (quem a página segue) recebe o que o Prisma chama de followers
            followingCount: user._count.followers,
            
            tweetsCount: user._count.tweets,
            tweets: mappedTweets,
        }

        return res.status(200).json({
            success: true,
            data: responseData,
        })

    } catch (error) {
        console.error('Erro ao buscar perfil de usuário:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao buscar o perfil.',
        })
    }
}

// -------------------------------------------------------------------
// 2. FOLLOW USER
// -------------------------------------------------------------------

export async function followUser(req: Request, res: Response): Promise<Response> {
    const followerId = req.user?.id
    const followingId = req.params.followingId

    if (!followerId) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado.',
        })
    }
    
    if (!followingId || followerId === followingId) {
        return res.status(400).json({
            success: false,
            message: 'ID do usuário alvo inválido ou tentativa de seguir a si mesmo.',
        })
    }

    try {
        const targetUser = await prismaClient.user.findUnique({
             where: { id: followingId }
        })

        if (!targetUser) {
             return res.status(404).json({
                 success: false,
                 message: 'Usuário que você está tentando seguir não existe.',
             })
        }

        const existingFollow = await prismaClient.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        })

        if (existingFollow) {
            // Retorna 409 Conflict se o recurso já existe
            return res.status(409).json({
                success: false,
                message: 'Você já segue este usuário.',
            })
        }
        
        const follow = await prismaClient.follows.create({
            data: {
                followerId,
                followingId,
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Usuário seguido com sucesso.',
            data: follow,
        })
    } catch (error) {
        console.error('Erro ao seguir usuário:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao tentar seguir usuário.',
        })
    }
}

// -------------------------------------------------------------------
// 3. UNFOLLOW USER
// -------------------------------------------------------------------

export async function unfollowUser(req: Request, res: Response): Promise<Response> {
    const followerId = req.user?.id
    const followingId = req.params.followingId

    if (!followerId) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado.',
        })
    }

    if (!followingId) {
        return res.status(400).json({
            success: false,
            message: 'ID do usuário alvo inválido.',
        })
    }

    try {
        const unfollow = await prismaClient.follows.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        })

        return res.status(200).json({
            success: true,
            message: 'Você deixou de seguir o usuário.',
            data: unfollow,
        })
    } catch (error) {
        // Trata P2025 (registro não encontrado para deleção) como 404 Not Found
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Relação de follow não encontrada (você não segue este usuário).',
            })
        }
        
        console.error('Erro ao deixar de seguir usuário:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao tentar deixar de seguir usuário.',
        })
    }
}

// -------------------------------------------------------------------
// 4. LIST USERS
// -------------------------------------------------------------------

export async function listUsers(req: Request, res: Response): Promise<Response> {
    try {
        const users = await prismaClient.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                imageUrl: true,
                createdAt: true,
                _count: {
                    select: { followers: true },
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
        
        const mappedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            followersCount: user._count.followers,
        }))

        return res.status(200).json({
            success: true,
            data: mappedUsers,
        })
    } catch (error) {
        console.error('Erro ao listar usuários:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao listar usuários.',
        })
    }
}