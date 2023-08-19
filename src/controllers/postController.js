import { getPostsService, getPostLimitService, getNewPostsService } from "../services/postService";

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
   const { page, ...query } = req.query
   try {
      const response = await getPostLimitService(page, query)
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