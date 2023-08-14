import { getPostsService } from "../services/postService";

export const getPostController = async (req, res) => {
   try {
      const response = await getPostsService()
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         msg: 'Failed at post controller' + error
      })
   }
} 