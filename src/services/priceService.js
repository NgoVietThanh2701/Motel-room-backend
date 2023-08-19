import db from '../models'

/* Get all category */
export const getPricesService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Price.findAll({
         raw: true,
         attributes: ['code', 'value']
      })
      resolve({
         err: response ? false : true,
         msg: response ? "Success" : 'Fail to get prices in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})