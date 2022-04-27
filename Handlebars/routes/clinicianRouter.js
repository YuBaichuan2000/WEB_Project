const express = require('express')

// create our Router object
const clinicianRouter = express.Router()

// import people controller functions
const clinicianController = require('../controllers/clinicianController')

// add a route to handle the GET request for all patients' data
clinicianRouter.get('/', clinicianController.getAllPatientData)
clinicianRouter.get('/comments', clinicianController.getAllComments)
// clinicianRouter.get('/', (req, res) => {
//     res.render('clinicianlogin', {style:'patient_dashboard.css', Username:'Pat'})
// })

// export the router
module.exports = clinicianRouter