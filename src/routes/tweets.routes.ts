import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.ts' 
import { createTweet, listTweets, deleteTweet } from '../controllers/tweet.controller.ts'
import { likeTweet, unlikeTweet } from '../controllers/like.controller.ts'
import { createComment, listComments } from '../controllers/comment.controller.ts'

const tweetsRouter = Router()

tweetsRouter.post('/', authMiddleware, createTweet)
tweetsRouter.get('/', authMiddleware, listTweets) 
tweetsRouter.post('/:tweetId/like', authMiddleware, likeTweet)
tweetsRouter.delete('/:tweetId/like', authMiddleware, unlikeTweet)
tweetsRouter.delete('/:tweetId', authMiddleware, deleteTweet)
tweetsRouter.post('/:tweetId/comments', authMiddleware, createComment)
tweetsRouter.get('/:tweetId/comments', listComments)

export { tweetsRouter }