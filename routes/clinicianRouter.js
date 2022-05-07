const express = require('express')
const passport = require('passport')
const clinicianRouter = express.Router()

const clinicianController = require('../controllers/clinicianController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()

}
// Login page (with failure message displayed upon login failure)
clinicianRouter.get('/login', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login' })
})
// GET all patients' data and comments
clinicianRouter.get('/', isAuthenticated, clinicianController.getAllPatientData)
clinicianRouter.get('/comments', clinicianController.getAllComments)

clinicianRouter.get('/test', (req, res) => {
    res.render('', {layout: 'clinician.hbs', style:''})
})

// Handle login
clinicianRouter.post('/login',
    passport.authenticate('clinician-strategy', {
        successRedirect: '/', failureRedirect: '/login', failureFlash: true
    })
)
// Handle logout
clinicianRouter.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

// export the clinicianRouter
module.exports = clinicianRouter