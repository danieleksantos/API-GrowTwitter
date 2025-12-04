import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.ts' 
import { getUserProfile, followUser, unfollowUser, listUsers } from '../controllers/user.controller.ts' 

const usersRouter = Router()

usersRouter.get('/', listUsers)
usersRouter.get('/:username', authMiddleware, getUserProfile)
usersRouter.post('/:followingId/follow', authMiddleware, followUser)
usersRouter.delete('/:followingId/follow', authMiddleware, unfollowUser)

export { usersRouter }