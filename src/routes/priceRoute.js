import express from 'express'
import { getPrices } from '../controllers/priceController'

const router = express.Router()

router.get('/all', getPrices)

export default router