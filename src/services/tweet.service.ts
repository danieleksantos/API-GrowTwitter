import { prismaClient } from '../database/prismaClient.js'; // Ajuste a extensão .js se necessário no seu tsconfig

interface CreateTweetParams {
    userId: string;
    content: string;
}

interface ListTweetsParams {
    currentUserId?: string;
    username?: string;
    type?: string;
    page: number;
}

export class TweetService {
    
    async create({ userId, content }: CreateTweetParams) {
        const newTweet = await prismaClient.tweet.create({
            data: { content, userId },
            include: {
                user: {
                    select: { id: true, username: true, name: true, imageUrl: true },
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            },
        });

        // Formatação para manter compatibilidade com o Frontend
        return {
            ...newTweet,
            likesCount: newTweet._count.likes,
            repliesCount: newTweet._count.comments,
            isLikedByMe: false, // Acabou de criar, não tem like
        };
    }

    async list({ currentUserId, username, type, page }: ListTweetsParams) {
        const take = 10;
        const skip = (page - 1) * take;
        let whereCondition: any = {};

        // Regra 1: Filtrar por usuário específico (Perfil)
        if (username) {
            const targetUser = await prismaClient.user.findUnique({
                where: { username },
                select: { id: true },
            });

            if (!targetUser) throw new Error('USER_NOT_FOUND');
            whereCondition = { userId: targetUser.id };
        } 
        // Regra 2: Feed Global
        else if (type === 'global') {
            whereCondition = {};
        } 
        // Regra 3: Feed "Seguindo" (Padrão)
        else {
            if (!currentUserId) throw new Error('UNAUTHORIZED');

            const followingRelations = await prismaClient.follows.findMany({
                where: { followerId: currentUserId },
                select: { followingId: true },
            });
            
            const followedUserIds = followingRelations.map(f => f.followingId);
            const userIdsToInclude = [currentUserId, ...followedUserIds];

            whereCondition = { userId: { in: userIdsToInclude } };
        }

        const tweets = await prismaClient.tweet.findMany({
            take,
            skip,
            where: whereCondition,
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
        });

        // Mapeamento dos dados
        const formattedTweets = tweets.map((tweet) => {
            const isLikedByMe = tweet.likes.length > 0;
            // Removemos 'likes' e '_count' do objeto final para ficar limpo, como no original
            const { likes, _count, ...rest } = tweet;

            return {
                ...rest,
                isLikedByMe,
                likesCount: _count.likes,
                repliesCount: _count.comments,
            };
        });

        return {
            data: formattedTweets,
            meta: { page, limit: take } // Adicionei total se quiser no futuro
        };
    }

    async delete(tweetId: string, requesterUserId: string) {
        const tweet = await prismaClient.tweet.findUnique({
            where: { id: tweetId },
            select: { userId: true }
        });

        if (!tweet) throw new Error('TWEET_NOT_FOUND');

        if (tweet.userId !== requesterUserId) {
            throw new Error('FORBIDDEN_DELETE');
        }

        await prismaClient.tweet.delete({ where: { id: tweetId } });
        return true;
    }
}