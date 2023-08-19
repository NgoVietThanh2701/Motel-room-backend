import db from '../models';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid'
import chothuephongtro from '../../data/chothuephongtro.json';
import nhachothue from '../../data/nhachothue.json';
import chothuecanho from '../../data/chothuecanho.json';
import chothuematbang from '../../data/chothuematbang.json'
import dotenv from 'dotenv';
import generateCode from '../utilis/generateCode';
import { dataPrice, dataArea, categories } from '../utilis/data';
import { getNumberFromString } from '../utilis/common';
dotenv.config();
const allData = [chothuephongtro.body, nhachothue.body, chothuecanho.body, chothuematbang.body]

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))
const categoryCode = ['CTPT', 'NCT', 'CTCH', 'CTMB']

export const insertService = () => new Promise(async (resolve, reject) => {
   try {
      const provinceCodes = []
      const labelCodes = []
      allData?.forEach((data, index) => {
         data.forEach(async (item) => {
            let postId = v4()
            let labelCode = generateCode(item?.header?.class?.classType).trim()
            labelCodes.every(item => item?.code !== labelCode) && labelCodes.push({
               code: labelCode,
               value: item?.header?.class.classType.trim()
            })
            let provinceCode = generateCode(item?.header?.address.split(',')?.slice(-1)[0]).trim()
            provinceCodes.every(item => item?.code !== provinceCode) && provinceCodes.push({
               code: provinceCode,
               value: item?.header?.address?.split(',').slice(-1)[0].trim()
            })
            let attributesId = v4()
            let userId = v4()
            let imagesId = v4()
            let overviewId = v4()
            let currentArea = getNumberFromString(item?.header.attributes.acreage)
            let currentPrice = getNumberFromString(item?.header.attributes.price)

            await db.Post.create({
               id: postId,
               title: item?.header?.title,
               star: item?.header?.star,
               labelCode,
               address: item?.header?.address,
               attributesId,
               categoryCode: categoryCode[index],
               description: JSON.stringify(item?.mainContent.content),
               userId,
               overviewId,
               imagesId,
               areaCode: dataArea.find(area => area.max > currentArea && area.min <= currentArea)?.code,
               priceCode: dataPrice.find(price => price.max > currentPrice && price.min <= currentPrice)?.code,
               provinceCode: provinceCode
            })
            await db.Attribute.create({
               id: attributesId,
               price: item?.header?.attributes?.price,
               acreage: item?.header?.attributes?.acreage,
               published: item?.header?.attributes?.published,
               hashtag: item?.header?.attributes?.hashtag,
            })
            await db.Image.create({
               id: imagesId,
               image: JSON.stringify(item?.images)
            })
            await db.Overview.create({
               id: overviewId,
               code: item?.overview?.content?.find(i => i.name === "Mã tin:")?.content,
               area: item?.overview?.content?.find(i => i.name === "Khu vực")?.content,
               type: item?.overview?.content?.find(i => i.name === "Loại tin rao:")?.content,
               target: item?.overview?.content?.find(i => i.name === "Đối tượng thuê:")?.content,
               bonus: item?.overview?.content?.find(i => i.name === "Gói tin:")?.content,
               created: item?.overview?.content?.find(i => i.name === "Ngày đăng:")?.content,
               expired: item?.overview?.content?.find(i => i.name === "Ngày hết hạn:")?.content,
            })
            await db.User.create({
               id: userId,
               name: item?.contact?.content?.find(i => i.name === "Liên hệ:")?.content,
               password: hashPassword('123456'),
               phone: item?.contact?.content?.find(i => i.name === "Điện thoại:")?.content,
               zalo: item?.contact?.content?.find(i => i.name === "Zalo")?.content,
            })
         })
      })

      /* insert category price area table */
      let bulkDataPrice = dataPrice.map(data => ({
         code: data.code,
         value: data.value
      }))
      await db.Price.bulkCreate(bulkDataPrice)
      let bulkDataArea = dataArea.map(data => ({
         code: data.code,
         value: data.value
      }))
      await db.Area.bulkCreate(bulkDataArea)
      await db.Category.bulkCreate(categories)
      await db.Province.bulkCreate(provinceCodes)
      await db.Label.bulkCreate(labelCodes)
      resolve('Insert data to dataase Done!.')
   } catch (err) {
      reject(err)
   }
})