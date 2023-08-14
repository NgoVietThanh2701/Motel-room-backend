import express from 'express'
import { getPostController } from '../controllers/postController';

const router = express.Router();

router.get('/all', getPostController)

export default router