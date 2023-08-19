import express from 'express'
import { getPosts, getPostsLimit, getNewPosts } from '../controllers/postController';

const router = express.Router();

router.get('/all', getPosts)
router.get('/limit', getPostsLimit)
router.get('/new-post', getNewPosts)

export default router