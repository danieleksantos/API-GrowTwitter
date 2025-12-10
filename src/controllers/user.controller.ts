
import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'

export async function getUserProfile(req: Request, res: Response): Promise<Response> {
    const { username } = req.params
    const currentUserId = req.user?.id 

    try {
        const user = await prismaClient.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                username: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                
                _count: {
                    select: {
                        followers: true, 
                        following: true, 
                        tweets: true, 
                    },
                },
                
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
        
        let isFollowing = false;
        
        if (currentUserId && user.id !== currentUserId) {
              const followRecord = await prismaClient.follows.findUnique({
                  where: {
                      followerId_followingId: {
                          followerId: currentUserId,
                          followingId: user.id, 
                      },
                  },
              });
              isFollowing = !!followRecord; 
        }

        const mappedTweets = user.tweets.map(tweet => {
            const isLikedByMe = tweet.likes.length > 0;
            const { likes, _count, ...restOfTweet } = tweet as any; 

            return {
                ...restOfTweet,
                isLikedByMe,
                likesCount: _count.likes,
                repliesCount: _count.comments,
                _count: undefined,
            }
        })

        const responseData = {
            id: user.id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            
            isFollowing: user.id !== currentUserId ? isFollowing : undefined, 
            
            followersCount: user._count.followers, 
            followingCount: user._count.following,
            
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

// follow

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

// unfollow
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

// list users
export async function listUsers(req: Request, res: Response): Promise<Response> {
    const currentUserId = req.user?.id
    
    const page = Number(req.query.page) || 1
    const limit = 8
    const skip = (page - 1) * limit

    try {
        let followingIds = new Set<string>()

        if (currentUserId) {
            const myFollows = await prismaClient.follows.findMany({
                where: { followerId: currentUserId },
                select: { followingId: true }
            })
            followingIds = new Set(myFollows.map(f => f.followingId))
        }

        const users = await prismaClient.user.findMany({
            take: limit,
            skip: skip,
            where: {
                ...(currentUserId ? { id: { not: currentUserId } } : {})
            },
            select: {
                id: true,
                name: true,
                username: true,
                imageUrl: true,
                createdAt: true,
                tweets: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        content: true,
                        createdAt: true
                    }
                },
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
            
            isFollowing: followingIds.has(user.id),
            
            latestTweet: user.tweets[0] ? {
                content: user.tweets[0].content,
                createdAt: user.tweets[0].createdAt
            } : null
        }))

        return res.status(200).json({
            success: true,
            data: mappedUsers,
            meta: {
                page,
                limit,
                total: mappedUsers.length
            }
        })

    } catch (error) {
        console.error('Erro ao listar usuários:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao listar usuários.',
        })
    }
}

//update user

export async function updateUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id
    const { name, imageUrl } = req.body

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado.',
        })
    }

    try {
        const userExists = await prismaClient.user.findUnique({ where: { id: userId } })
        
        if (!userExists) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' })
        }

        const updatedUser = await prismaClient.user.update({
            where: { id: userId },
            data: {
                name,     
                imageUrl, 
            },
            select: {
                id: true,
                name: true,
                username: true,
                imageUrl: true,
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Perfil atualizado com sucesso!',
            data: updatedUser,
        })

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao atualizar perfil.',
        })
    }
}