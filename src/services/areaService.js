import db from '../models'

/* Get all area */
export const getAreasService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Area.findAll({
         raw: true,
         attributes: ['code', 'value']
      })
      resolve({
         err: response ? false : true,
         msg: response ? "Success" : 'Fail to get area in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})