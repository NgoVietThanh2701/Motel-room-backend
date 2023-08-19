import authRouter from './authRoute.js';
import insertRouter from './insertRoute.js'
import categoryRoute from './categoryRoute.js'
import postRoute from './postRoute.js'
import priceRoute from './priceRoute.js'
import areaRoute from './areaRoute.js'
import provinceRoute from './provinceRoute.js'

const initRoutes = (app) => {
   app.use('/api/v1/auth', authRouter)
   app.use('/api/v1/insert', insertRouter)
   app.use('/api/v1/category', categoryRoute)
   app.use('/api/v1/post', postRoute)
   app.use('/api/v1/price', priceRoute)
   app.use('/api/v1/area', areaRoute)
   app.use('/api/v1/province', provinceRoute)
}

export default initRoutes