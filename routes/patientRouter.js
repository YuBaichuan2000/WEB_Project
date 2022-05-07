const express = require('express')
const passport = require('passport')
// create our Router object
const patientRouter = express.Router()

// import people controller functions
const patientController = require('../controllers/patientController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
// If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}


// patient dashboard
patientRouter.get('/', isAuthenticated, (req, res, next) => {
    res.render('dashboard', {layout: 'patient.hbs', style:'patient_dashboard.css', Username:'Pat'})
})
// Login page (with failure message displayed upon login failure)
patientRouter.get('/login', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login' })
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

// Handle login
patientRouter.post('/login',
    passport.authenticate('patiient-strategy', {
        successRedirect: '/', failureRedirect: '/login', failureFlash: true
    })
)
// Handle logout
patientRouter.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

// export the patientRouter
module.exports = patientRouter