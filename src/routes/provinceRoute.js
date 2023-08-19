import express from 'express'
import { getProvinces } from '../controllers/provinceController'

const router = express.Router()

router.get('/all', getProvinces)

export default router