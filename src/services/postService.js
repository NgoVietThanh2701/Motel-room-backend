import db from '../models'
import { Op } from 'sequelize'
import { v4 as generateId } from 'uuid'
import generateCode from '../utilis/generateCode'
import moment from 'moment'
import { generateDate } from '../utilis/common'

export const getPostsService = () => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Post.findAndCountAll({
         raw: true,
         nest: true,
         include: [
            { model: db.Image, as: 'images', attributes: ['image'] },
            {
               model: db.Attribute, as: 'attributes',
               attributes: ['price', 'acreage', 'published', 'hashtag'],
            },
            { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] }
         ],
         attributes: ["id", 'title', 'star', 'address', 'description'],
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

export const getPostLimitService = (page, query, { priceNumber, areaNumber }) => new Promise(async (resolve, reject) => {
   try {
      let offset = (!page || +page <= 1) ? 0 : (+page - 1) * process.env.LIMIT
      const queries = { ...query }
      if (priceNumber) {
         queries.priceNumber = { [Op.between]: priceNumber }
      }
      if (areaNumber) {
         queries.areaNumber = { [Op.between]: areaNumber }
      }
      const response = await db.Post.findAndCountAll({
         where: queries,
         raw: true,
         nest: true,
         offset: offset,
         limit: +process.env.LIMIT || 0,
         order: [['createdAt', 'DESC']],
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

export const createNewPostService = (body, userId, images) => new Promise(async (resolve, reject) => {
   try {
      const attributesId = generateId()
      const imagesId = generateId()
      const overviewId = generateId()
      const labelCode = generateCode(body.label)
      const hashtag = Math.floor(Math.random() * (10 ** 6))
      const currentDate = generateDate()
      await db.Post.create({
         id: generateId(),
         title: body.title,
         labelCode,
         star: 3,
         address: body?.address || null,
         attributesId,
         categoryCode: body.categoryCode,
         description: JSON.stringify(body.description) || null,
         userId,
         overviewId,
         imagesId,
         areaCode: body.areaCode || null,
         priceCode: body.priceCode || null,
         provinceCode: body.province.includes('Thành phố') ? generateCode(body.province.replace('Thành phố ', '')) :
            generateCode(body.province?.replace('Tỉnh ', '')) || null,
         priceNumber: +body.priceNumber,
         areaNumber: +body.areaNumber
      })
      await db.Attribute.create({
         id: attributesId,
         price: body.priceNumber < 1 ? `${+body.priceNumber * (10 ** 6)} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
         acreage: `${body.areaNumber}m2`,
         published: moment(new Date()).format('DD/MM/YYYY'),
         hashtag: `#${hashtag}`
      })
      await db.Image.create({
         id: imagesId,
         image: JSON.stringify(images)
      })
      await db.Overview.create({
         id: overviewId,
         code: `#${hashtag}`,
         area: body.label,
         type: body?.category || null,
         target: body?.target,
         bonus: 'Tin thường',
         created: currentDate.today,
         expired: currentDate.expireDay,
      })
      await db.Province.findOrCreate({
         where: {
            [Op.or]: [
               { value: body.province.replace('Thành phố ', '') },
               { value: body?.province.replace('Tỉnh ', '') }
            ]
         },
         defaults: {
            code: body.province.includes('Thành phố') ? generateCode(body.province.replace('Thành phố ', '')) : generateCode(body.province?.replace('Tỉnh ', '')),
            value: body.province.includes('Thành phố') ? body.province.replace('Thành phố ', '') : body.province?.replace('Tỉnh ', ''),
         }
      })
      await db.Label.findOrCreate({
         where: {
            code: labelCode
         },
         defaults: {
            code: labelCode,
            value: body.label
         }
      })
      resolve({
         err: false,
         msg: 'Tạo bài đăng thành công!',
      })
   } catch (error) {
      reject(error)
   }
})

export const getPostLimitServiceAdmin = (page, query, id) => new Promise(async (resolve, reject) => {
   try {
      let offset = (!page || +page <= 1) ? 0 : (+page - 1) * process.env.LIMIT
      const queries = { ...query, userId: id }
      const response = await db.Post.findAndCountAll({
         where: queries,
         raw: true,
         nest: true,
         offset: offset,
         limit: +process.env.LIMIT || 0,
         order: [['createdAt', 'DESC']],
         include: [
            { model: db.Image, as: 'images', attributes: ['image'] },
            { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            { model: db.Overview, as: 'overviews' }
         ],
         attributes: ["id", 'title', 'star', 'categoryCode', 'address', 'description']
      })
      resolve({
         err: response ? false : true,
         msg: response ? 'Ok' : 'Fail get posts in service admin',
         lengthPage: +process.env.LIMIT || 0,
         response
      })
   } catch (error) {
      reject(error)
   }
})

export const deletePostLimitServiceAdmin = (postId) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Post.destroy({
         where: { id: postId }
      })
      resolve({
         err: response > 0 ? false : true,
         msg: response > 0 ? 'Deleted' : 'Fail delete in service admin',
      })
   } catch (error) {
      reject(error)
   }
})



