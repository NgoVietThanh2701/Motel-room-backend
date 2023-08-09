import authRoute from './authRoute.js';

const initRoutes = (app) => {
   app.use('/api/v1/auth', authRoute)
}

export default initRoutes