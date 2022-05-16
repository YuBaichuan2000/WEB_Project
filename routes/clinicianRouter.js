const express = require('express')
const passport = require('passport')
const clinicianRouter = express.Router()
const clinicianController = require('../controllers/clinicianController')

// Handle login
clinicianRouter.post('/login',
    passport.authenticate('clinician-strategy', {
        successRedirect: '/clinician/dashboard', failureRedirect: '/', failureFlash: true
    })
)

clinicianRouter.get('/webc', (req, res) => {
    res.render('desktoplogin', {patient: false, style:"desktoplogin.css"})
})

// GET all patients' data and comments
clinicianRouter.get('/dashboard', clinicianController.getAllPatientData)

clinicianRouter.get('/comments', clinicianController.getAllComments)

// sign up new patient
clinicianRouter.get('/signup', (req, res, next) => {
    res.render('signup', {layout: 'clinician.hbs', style:'signup.css'})
})
clinicianRouter.post('/signup', clinicianController.insertPatient)

clinicianRouter.get('/test', (req, res) => {
    res.render('signupnewpatient.hbs', {layout: 'clinician.hbs', style:'signupnewpatient.css'})
})
// Handle logout
// clinicianRouter.post('/logout', (req, res) => {
//     req.logout()
//     res.redirect('/')
// })

// export the clinicianRouter
module.exports = clinicianRouter