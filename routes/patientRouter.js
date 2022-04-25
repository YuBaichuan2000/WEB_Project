const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all patients' data
// patientRouter.get('/', patientController.getAllData)
patientRouter.get('/', patientController.showForm)
patientRouter.post('/', patientController.insertData)
patientRouter.get('/data', patientController.getAllData)

// // add a new JSON object to the database
// peopleRouter.post('/addAuthor', peopleController.insertData)

// export the router
module.exports = patientRouter