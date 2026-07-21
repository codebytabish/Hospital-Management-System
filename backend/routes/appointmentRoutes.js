const express = require('express')
const router = express.Router()
const {
  bookAppointment,
  getMyAppointments,
  getAppointment,
  updateStatus,
  cancelAppointment,
  getAllAppointments
} = require('../controllers/appointmentController')
const { protect, authorizeRoles } = require('../middleware/auth')

router.use(protect)

router.post('/', authorizeRoles('patient'), bookAppointment)
router.get('/', getMyAppointments)
router.get('/all', authorizeRoles('admin'), getAllAppointments)
router.get('/:id', getAppointment)
router.patch('/:id/status', authorizeRoles('doctor', 'admin'), updateStatus)
router.delete('/:id', cancelAppointment)

module.exports = router