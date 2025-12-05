
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
                
                followers: {
                    where: { followerId: currentUserId },
                    select: { followerId: true }
                },

                _count: {
                    select: {
                        followers: true, 
                        following: true, 
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
        
        const mappedTweets = user.tweets.map(tweet => {
            const isLikedByMe = tweet.likes.length > 0;
            const { likes, ...restOfTweet } = tweet;

            return {
                ...restOfTweet,
                isLikedByMe,
                likesCount: restOfTweet._count.likes,
                repliesCount: restOfTweet._count.comments,
                _count: undefined,
            }
        })
        
        const isFollowing = user.followers.length > 0;

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


export async function followUser(req: Request, res: Response): Promise<Response> {
    const followerId = req.user?.id
    const followingId = req.params.followingId

    if (!followerId || followerId === followingId) {
        return res.status(400).json({
            success: false,
            message: 'Não é possível seguir a si mesmo ou ID de seguidor inválido.',
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


export async function unfollowUser(req: Request, res: Response): Promise<Response> {
    const followerId = req.user?.id
    const followingId = req.params.followingId

    if (!followerId) {
        return res.status(401).json({
            success: false,
            message: 'ID de seguidor inválido.',
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