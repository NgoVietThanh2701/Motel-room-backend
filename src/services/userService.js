import db from '../models'

/* Get current user */
export const getOne = (id) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.findOne({
         where: { id },
         raw: true,
         attributes: {
            exclude: ['password']
         }
      })
      resolve({
         err: response ? false : true,
         msg: response ? "Success" : 'Fail to get one user in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})