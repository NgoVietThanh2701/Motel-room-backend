import { getPricesService } from '../services/priceService';

export const getPrices = async (req, res) => {
   try {
      const response = await getPricesService()
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json({
         err: true,
         msg: 'Failed at price controller ' + error
      })
   }
}