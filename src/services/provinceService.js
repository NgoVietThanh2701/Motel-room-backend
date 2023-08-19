import db from '../models'

/* Get all province */
export const getProvincesService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Province.findAll({
         raw: true,
         attributes: ['code', 'value']
      })
      resolve({
         err: response ? false : true,
         msg: response ? "Success" : 'Fail to get province in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})