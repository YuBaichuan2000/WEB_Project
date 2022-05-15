const express = require('express')
const passport = require('passport')
// create our Router object
const patientRouter = express.Router()
const utility = require("./patientUtility.js");

// import people controller functions
const patientController = require('../controllers/patientController')

// Handle login
patientRouter.post('/login',
    passport.authenticate('patient-strategy', {
        successRedirect: '/patient/dashboard', failureRedirect: '/', failureFlash: true
    })
)

// login page for web size
patientRouter.get('/webp', utility.unLoggedIn, (req, res) => {
    res.render('desktoplogin', {patient: true, style:"desktoplogin.css"}, req.session.flash)
})
// patient dashboard
patientRouter.get('/dashboard',utility.isLoggedIn,(req, res, next) => {
    res.render('dashboard', {layout: 'patient.hbs', style:'patient_dashboard.css', Username:'Pat'})
})

// get all patient's histry data
patientRouter.get('/history_data',utility.isLoggedIn, patientController.getAllData)

// display and post new data
patientRouter.get('/record_data', utility.isLoggedIn, patientController.showForm)
patientRouter.post('/record_data', patientController.insertData)

patientRouter.get('/leaderboard', (req, res) => {
    res.render('leaderboard')
})
patientRouter.get('/messages', utility.isLoggedIn, (req, res) => {
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



// export the patientRouter
module.exports = patientRouter