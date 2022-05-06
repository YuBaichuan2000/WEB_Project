const express = require('express')

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// patient dashboard
patientRouter.get('/', (req, res) => {
    res.render('dashboard', {layout: 'patient.hbs', style:'patient_dashboard.css', Username:'Pat'})
})

// get all patient's histry data
patientRouter.get('/history_data', patientController.getAllData)

// display and post new data
patientRouter.get('/record_data', patientController.showForm)
patientRouter.post('/record_data', patientController.insertData)

patientRouter.get('/leaderboard', (req, res) => {
    res.render('leaderboard')
})
patientRouter.get('/messages', (req, res) => {
    res.render('messages')
})

// about website and about diabetes for logged in users
patientRouter.get('/diabetes', (req, res) => {
    res.render('diabetes',{style:'stylesheet.css', loggedout: false})
})
patientRouter.get('/website', (req, res) => {
    res.render('website',{style:'stylesheet.css', loggedout: false})
})

patientRouter.get('/test', (req, res) => {
    res.render('', {layout: 'patient.hbs', style:''})
})

// export the router
module.exports = patientRouter