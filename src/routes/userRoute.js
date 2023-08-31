import express from 'express'
import verifyToken from '../middleware/verifyToken'
import { getCurrentUser } from '../controllers/userController'

const router = express.Router()
/* verify token before use router*/
router.use(verifyToken)
router.get('/get-current', getCurrentUser)

export default router