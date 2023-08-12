import db from '../models'

/* Get all category */
export const getCategories = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Category.findAll({
         raw: true,
         attributes: ['code', 'value']
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