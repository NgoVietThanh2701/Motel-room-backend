import { getAreasService } from '../services/areaService';

export const getAreas = async (req, res) => {
   try {
      const response = await getAreasService()
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         err: true,
         msg: 'Failed at area controller ' + error
      })
   }
}