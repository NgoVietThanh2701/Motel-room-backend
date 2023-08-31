import express from 'express'
import { getPosts, getPostsLimit, getNewPosts, createNewPost, getPostsLimitAdmin, deletePostsLimitAdmin } from '../controllers/postController';
import verifyToken from '../middleware/verifyToken'
import multer from 'multer';
import path from 'path'
import crypto from 'crypto'

const router = express.Router();

router.get('/all', getPosts)
router.get('/limit', getPostsLimit)
router.get('/new-post', getNewPosts)

/* route for system */
router.use(verifyToken)

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      // Xác định nơi lưu trữ tệp tin tải lên
      cb(null, './public/images/posts')
   },
   filename: function (req, file, cb) {
      // Tạo tên tệp tin mới cho tệp tin tải lên
      const ext = path.extname(file.originalname);
      const fileName = crypto.createHash('md5').update(file.originalname + Date.now().toString()).digest("hex") + ext;
      cb(null, fileName)
   }
})

const upload = multer({ storage: storage })
router.post('/create-new', upload.array('images', '20'), createNewPost)

router.get('/limit-admin', getPostsLimitAdmin)
router.delete('/delete', deletePostsLimitAdmin)

export default router