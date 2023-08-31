import { getPostsService, getPostLimitService, getNewPostsService, createNewPostService, getPostLimitServiceAdmin, deletePostLimitServiceAdmin } from "../services/postService";

export const getPosts = async (req, res) => {
   try {
      const response = await getPostsService()
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at get post controller' + error
      })
   }
}

export const getPostsLimit = async (req, res) => {
   const { page, priceNumber, areaNumber, ...query } = req.query
   try {
      const response = await getPostLimitService(page, query, { priceNumber, areaNumber })
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at get post limit controller' + error
      })
   }
}

export const getNewPosts = async (req, res) => {
   try {
      const response = await getNewPostsService()
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at get new post controller' + error
      })
   }
}

export const createNewPost = async (req, res) => {
   const files = req.files;
   if (!files || files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded" });
   }
   try {
      const { categoryCode, title, priceNumber, areaNumber, label } = req.body
      const { id } = req.user
      /* handle images */
      const images = []
      for (let file of files) {
         const fileName = file.filename
         const url = `${req.protocol}://${req.get("host")}/images/posts/${fileName}`;
         images.push(url)
      }
      if (!categoryCode || !id || !title || !priceNumber || !areaNumber || !label) {
         return res.status(400).json({
            err: true,
            msg: 'Missgin input'
         })
      }
      const response = await createNewPostService(req.body, id, images)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at create new post controller' + error
      })
   }
}

export const getPostsLimitAdmin = async (req, res) => {
   const { page, ...query } = req.query
   const id = req.user.id
   try {
      const response = await getPostLimitServiceAdmin(page, query, id)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at get post limit controller' + error
      })
   }
}

export const deletePostsLimitAdmin = async (req, res) => {
   const { postId } = req.query
   try {
      if (!postId) {
         return res.status(400).json({
            msg: true,
            msg: 'postId missing input'
         })
      }
      const response = await deletePostLimitServiceAdmin(postId)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at get post limit controller' + error
      })
   }
}