import { insertService } from '../services/insertService.js'

export const insert = async (req, res) => {
   try {
      const response = await insertService()
      return res.status(200).json(response)
   } catch (err) {
      return res.status(500).json({
         err: true,
         msg: 'Fail at insert controller' + err
      })
   }
}