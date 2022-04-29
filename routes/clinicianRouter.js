const express = require('express')

const clinicianRouter = express.Router()

const clinicianController = require('../controllers/clinicianController')

// GET all patients' data and comments
clinicianRouter.get('/', clinicianController.getAllPatientData)
clinicianRouter.get('/comments', clinicianController.getAllComments)

// export the router
module.exports = clinicianRouter