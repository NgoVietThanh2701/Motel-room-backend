import { getCategoriesService } from '../services/categoryService';

export const getCategories = async (req, res) => {
   try {
      const response = await getCategoriesService()
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         err: true,
         msg: 'Failed at category controller ' + error
      })
   }
}