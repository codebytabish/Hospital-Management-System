const express = require('express')
const router = express.Router()
const {
  createPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPrescription
} = require('../controllers/prescriptionController')
const { protect, authorizeRoles } = require('../middleware/auth')

router.use(protect)

router.post('/', authorizeRoles('doctor'), createPrescription)
router.get('/doctor', authorizeRoles('doctor'), getDoctorPrescriptions)
router.get('/patient', authorizeRoles('patient'), getPatientPrescriptions)
router.get('/:id', getPrescription)

module.exports = router