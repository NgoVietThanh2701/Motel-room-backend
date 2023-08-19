import db from '../models'

export const getPostsService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Post.findAll({
         raw: true,
         nest: true,
         include: [
            { model: db.Image, as: 'images', attributes: ['image'] },
            { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] }
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

export const getPostLimitService = (page, query) => new Promise(async (resolve, reject) => {
   try {
      let offset = (!page || +page <= 1) ? 0 : (+page - 1) * process.env.LIMIT
      const response = await db.Post.findAndCountAll({
         where: query,
         raw: true,
         nest: true,
         offset: offset,
         limit: +process.env.LIMIT || 0,
         include: [
            { model: db.Image, as: 'images', attributes: ['image'] },
            { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] }
         ],
         attributes: ["id", 'title', 'star', 'categoryCode', 'address', 'description']
      })
      resolve({
         err: response ? false : true,
         msg: response ? 'Ok' : 'Fail get posts in service',
         lengthPage: +process.env.LIMIT || 0,
         response
      })
   } catch (error) {
      reject(error)
   }
})

export const getNewPostsService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Post.findAll({
         raw: true,
         nest: true,
         order: [['createdAt', 'DESC']],
         offset: 0,
         limit: +process.env.LIMIT,
         include: [
            { model: db.Image, as: 'images', attributes: ['image'] },
            { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
         ],
         attributes: ["id", 'title', 'star', 'createdAt']
      })
      resolve({
         err: response ? false : true,
         msg: response ? 'Ok' : 'Fail get new posts  in service',
         response
      })
   } catch (error) {
      reject(error)
   }
})

