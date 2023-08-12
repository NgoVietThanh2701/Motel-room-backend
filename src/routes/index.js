import authRouter from './authRoute.js';
import insertRouter from './insertRoute.js'
import categoryRoute from './categoryRoute.js'

const initRoutes = (app) => {
   app.use('/api/v1/auth', authRouter)
   app.use('/api/v1/insert', insertRouter)
   app.use('/api/v1/category', categoryRoute)
}

export default initRoutes