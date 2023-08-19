import db from '../models'

/* Get all category */
export const getCategoriesService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Category.findAll({
         raw: true,
      })
      resolve({
         err: response ? false : true,
         msg: response ? "Success" : 'Fail to get categories in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})