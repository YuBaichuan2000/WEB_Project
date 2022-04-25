const express = require('express')

// create our Router object
const testRouter = express.Router()

// import people controller functions
const testController = require('../controllers/testController')

// add a route to handle the GET request for all patients' data
testRouter.get('/', testController.getAllTestData)

// clinicianRouter.get('/comments', clinicianController.getAllComments)

// // add a new JSON object to the database
// peopleRouter.post('/addAuthor', peopleController.insertData)

// export the router
module.exports = testRouter