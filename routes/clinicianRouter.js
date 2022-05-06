const express = require('express')

const clinicianRouter = express.Router()

const clinicianController = require('../controllers/clinicianController')

// GET all patients' data and comments
clinicianRouter.get('/', clinicianController.getAllPatientData)
clinicianRouter.get('/comments', clinicianController.getAllComments)

clinicianRouter.get('/test', (req, res) => {
    res.render('', {layout: 'clinician.hbs', style:''})
})

// export the router
module.exports = clinicianRouter