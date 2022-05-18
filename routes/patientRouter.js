const express = require('express')
const passport = require('passport')
// create our Router object
const patientRouter = express.Router()
const utility = require("./patientUtility.js");

// import people controller functions
const patientController = require('../controllers/patientController')

// Handle login
patientRouter.post('/webp',
    passport.authenticate('patient-strategy', {
        successRedirect: '/patient/dashboard', failureRedirect: '/patient/webp', failureFlash: true
    })
)

// login page for web size
patientRouter.get('/webp', utility.unLoggedIn, (req, res) => {
    console.log(req.session);
    res.render('desktoplogin',  {warning: req.session.flash, patient: true, style:"desktoplogin.css"})
    
})
// patient dashboard
patientRouter.get('/dashboard', utility.isLoggedIn, patientController.getDashboard)

// get patient's history data
patientRouter.get('/history_data', utility.isLoggedIn, patientController.getAllData)

// display and post new data
patientRouter.get('/record_data', utility.isLoggedIn, patientController.showForm)
patientRouter.post('/record_data', patientController.insertData)

patientRouter.get('/leaderboard', patientController.getLeaderboard)

// get patient's history messages
patientRouter.get('/messages', utility.isLoggedIn, patientController.getAllMessages)

// about website and about diabetes for logged in users
patientRouter.get('/diabetes', (req, res) => {
    res.render('diabetes',{style:'stylesheet.css', loggedout: false})
})
patientRouter.get('/website', (req, res) => {
    res.render('website',{style:'stylesheet.css', loggedout: false})
})

// patientRouter.post("/encrypt", patientController.encrypt);

patientRouter.get('/test', (req, res) => {
    res.render('leaderboard.hbs', {layout: 'patient.hbs', style:'leaderboard.css'})
})



// export the patientRouter
module.exports = patientRouter