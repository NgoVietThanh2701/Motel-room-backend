import { getOne } from '../services/userService';

export const getCurrentUser = async (req, res) => {
   const { id } = req.user
   try {
      const response = await getOne(id)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         err: true,
         msg: 'Failed at user controller ' + error
      })
   }
}