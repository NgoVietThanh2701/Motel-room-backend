import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid'
import dotenv from 'dotenv';
import { verifyJwtToken } from '../utilis/configToken';
dotenv.config();

export const tokenList = {}

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const registerService = ({ phone, password, name }) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.findOrCreate({
         where: { phone },
         defaults: {
            phone,
            name,
            password: hashPassword(password),
            id: v4()
         },
      })
      /* */
      const token = response[1] && jwt.sign({ id: response[0].id, phone: response[0].phone },
         process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_LIFE });
      const refreshToken = response[1] && jwt.sign({ id: response[0].id, phone: response[0].phone },
         process.env.SECRET_KEY_REFRESH, { expiresIn: process.env.REFRESH_TOKEN_LIFE })
      tokenList[refreshToken] = response
      resolve({
         err: token ? false : true,
         msg: token ? 'Register successfully' : 'Phone has been already used',
         token: token || null,
         refreshToken: refreshToken || null
      })
   } catch (err) {
      reject(err)
   }
})

export const loginService = ({ phone, password }) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.findOne({
         where: { phone },
         raw: true
      })
      /* check password */
      const isCorrectPassword = response && bcrypt.compareSync(password, response.password)
      /* */
      const token = isCorrectPassword && jwt.sign({ id: response.id, phone: response.phone, },
         process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_LIFE });
      const refreshToken = isCorrectPassword && jwt.sign({ id: response.id, phone: response.phone, },
         process.env.SECRET_KEY_REFRESH, { expiresIn: process.env.REFRESH_TOKEN_LIFE });
      tokenList[refreshToken] = response
      resolve({
         err: token ? false : true,
         msg: token ? 'Login successfully' : response ? 'Password wrong!' : 'Phone not found!',
         token: token || null,
         refreshToken: refreshToken || null
      })
   } catch (err) {
      reject(err)
   }
})

export const refreshTokenService = (refreshToken) => new Promise(async (resolve, reject) => {
   if ((refreshToken) && (refreshToken in tokenList)) {
      try {
         await verifyJwtToken(refreshToken, process.env.SECRET_KEY_REFRESH)
         const response = tokenList[refreshToken]
         /* create new token and response for user */
         const token = jwt.sign({ id: response.id, phone: response.phone }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_LIFE })
         resolve({
            err: false,
            token
         })
      } catch (error) {
         reject(error)
      }
   }
   reject('refresh token issue!')
})