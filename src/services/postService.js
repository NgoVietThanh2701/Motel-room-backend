import db from '../models'

export const getPostsService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Post.findAll({
         raw: true,
         nest: true,
         include: [
            {
               model: db.Image,
               as: 'images',
               attributes: ['image']
            },
            {
               model: db.Attribute,
               as: 'attributes',
               attributes: ['price', 'acreage', 'published', 'hashtag']
            },
            {
               model: db.User,
               as: 'user',
               attributes: ['name', 'zalo', 'phone']
            }
         ],
         attributes: ["id", 'title', 'star', 'address', 'description']
      })
      resolve({
         err: response ? false : true,
         msg: response ? 'Ok' : 'Fail get posts in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})