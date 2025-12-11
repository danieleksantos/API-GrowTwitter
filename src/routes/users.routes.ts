import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js' 
import { getUserProfile, followUser, unfollowUser, listUsers, updateUser } from '../controllers/user.controller.js' 

const usersRouter = Router()

usersRouter.get('/', authMiddleware, listUsers)
usersRouter.get('/:username', authMiddleware, getUserProfile)
usersRouter.put('/', authMiddleware, updateUser)
usersRouter.post('/:followingId/follow', authMiddleware, followUser)
usersRouter.delete('/:followingId/follow', authMiddleware, unfollowUser)

export { usersRouter }