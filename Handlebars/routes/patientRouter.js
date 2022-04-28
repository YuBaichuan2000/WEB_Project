const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all patients' data
patientRouter.get('/', (req, res) => {
    res.render('dashboard', {layout: 'patient.hbs', style:'patient_dashboard.css', Username:'Pat'})
})

patientRouter.get('/record_data', patientController.showForm)
patientRouter.post('/record_data', patientController.insertData)
patientRouter.get('/history_data', patientController.getAllData)

patientRouter.get('/leaderboard', (req, res) => {
    res.render('leaderboard')
})
patientRouter.get('/messages', (req, res) => {
    res.render('messages')
})

patientRouter.get('/diabetes', (req, res) => {
    res.render('diabetes',{style:'stylesheet.css', loggedout: false})
})
patientRouter.get('/website', (req, res) => {
    res.render('website',{style:'stylesheet.css', loggedout: false})
})

// export the router
module.exports = patientRouter