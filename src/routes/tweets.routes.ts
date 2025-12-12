import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

// Controllers Refatorados
import { createTweet, listTweets, deleteTweet } from '../controllers/tweet.controller.js';
import { likeTweet, unlikeTweet } from '../controllers/like.controller.js';
import { createComment, listComments } from '../controllers/comment.controller.js';

const tweetsRouter = Router();

// Rotas de Tweets
tweetsRouter.post('/', authMiddleware, createTweet);
tweetsRouter.get('/', authMiddleware, listTweets); 
tweetsRouter.delete('/:tweetId', authMiddleware, deleteTweet);

// Rotas de Likes
tweetsRouter.post('/:tweetId/like', authMiddleware, likeTweet);
tweetsRouter.delete('/:tweetId/like', authMiddleware, unlikeTweet);

// Rotas de Comentários
tweetsRouter.post('/:tweetId/comments', authMiddleware, createComment);
tweetsRouter.get('/:tweetId/comments', listComments);

export { tweetsRouter };