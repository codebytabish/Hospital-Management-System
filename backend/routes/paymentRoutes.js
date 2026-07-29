const express = require('express')
const router = express.Router()
const { createPayment, getMyPayments } = require('../controllers/paymentController')
const { protect, authorizeRoles } = require('../middleware/auth')

router.use(protect)
router.post('/', authorizeRoles('patient'), createPayment)
router.get('/my', authorizeRoles('patient'), getMyPayments)

module.exports = router