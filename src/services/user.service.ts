import { prismaClient } from '../database/prismaClient.js';

interface UpdateUserParams {
    userId: string;
    name?: string;
    imageUrl?: string;
}

export class UserService {

    async getProfile(username: string, currentUserId?: string) {
        const user = await prismaClient.user.findUnique({
            where: { username },
            select: {
                id: true, name: true, username: true, imageUrl: true, createdAt: true, updatedAt: true,
                _count: {
                    select: { 
                        followers: true,
                        following: true,
                        tweets: true 
                    },
                },
                tweets: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { id: true, username: true, name: true, imageUrl: true },
                        },
                        likes: {
                            where: currentUserId ? { userId: currentUserId } : undefined,
                            select: { userId: true }
                        },
                        _count: {
                            select: { likes: true, comments: true }
                        }
                    },
                },
            },
        });

        if (!user) throw new Error('USER_NOT_FOUND');

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

        const mappedTweets = user.tweets.map((tweet: any) => {
            const isLikedByMe = tweet.likes.length > 0;
            const { likes, _count, ...rest } = tweet;
            return {
                ...rest,
                isLikedByMe,
                likesCount: _count.likes,
                repliesCount: _count.comments,
            };
        });

        return {
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
        };
    }

    async list(currentUserId: string | undefined, page: number) {
        const limit = 8;
        const skip = (page - 1) * limit;

        let followingIds = new Set<string>();
        if (currentUserId) {
            const myFollows = await prismaClient.follows.findMany({
                where: { followerId: currentUserId },
                select: { followingId: true }
            });
            followingIds = new Set(myFollows.map(f => f.followingId));
        }

        const whereCondition = {
            ...(currentUserId ? { id: { not: currentUserId } } : {})
        };

        const [users, total] = await Promise.all([
            prismaClient.user.findMany({
                take: limit,
                skip: skip,
                where: whereCondition,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, username: true, imageUrl: true, createdAt: true,
                    tweets: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                        select: { content: true, createdAt: true }
                    },
                    _count: { 
                        select: { followers: true } 
                    } 
                },
            }),
            prismaClient.user.count({ where: whereCondition })
        ]);

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
        }));

        return {
            data: mappedUsers,
            meta: { page, limit, total }
        };
    }

    async follow(followerId: string, followingId: string) {
        if (followerId === followingId) throw new Error('SELF_FOLLOW');

        const targetUser = await prismaClient.user.findUnique({ where: { id: followingId } });
        if (!targetUser) throw new Error('USER_NOT_FOUND');

        const existingFollow = await prismaClient.follows.findUnique({
            where: {
                followerId_followingId: { followerId, followingId },
            },
        });

        if (existingFollow) throw new Error('ALREADY_FOLLOWING');

        return await prismaClient.follows.create({
            data: { followerId, followingId },
        });
    }

    async unfollow(followerId: string, followingId: string) {
        try {
            return await prismaClient.follows.delete({
                where: {
                    followerId_followingId: { followerId, followingId },
                },
            });
        } catch (error: any) {
            if (error.code === 'P2025') throw new Error('NOT_FOLLOWING');
            throw error;
        }
    }

    async update({ userId, name, imageUrl }: UpdateUserParams) {
        const userExists = await prismaClient.user.findUnique({ where: { id: userId } });
        if (!userExists) throw new Error('USER_NOT_FOUND');

        return await prismaClient.user.update({
            where: { id: userId },
            data: { name, imageUrl },
            select: {
                id: true, name: true, username: true, imageUrl: true
            }
        });
    }
}