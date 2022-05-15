const express = require('express')
const passport = require('passport')
const clinicianRouter = express.Router()
const utility = require("./clinicianUtility.js");
const clinicianController = require('../controllers/clinicianController')

// Handle login
clinicianRouter.post('/login',
    passport.authenticate('clinician-strategy', {
        successRedirect: '/clinician/dashboard', failureRedirect: '/', failureFlash: true
    })
)

clinicianRouter.get('/webc', utility.unLoggedIn, (req, res) => {
    res.render('desktoplogin', {patient: false, style:"desktoplogin.css"})
})

// GET all patients' data and comments
clinicianRouter.get('/dashboard', utility.isLoggedIn, clinicianController.getAllPatientData)

clinicianRouter.get('/comments', utility.isLoggedIn, clinicianController.getAllComments)

clinicianRouter.get('/test', (req, res) => {
    res.render('', {layout: 'clinician.hbs', style:''})
})
// Handle logout
// clinicianRouter.post('/logout', (req, res) => {
//     req.logout()
//     res.redirect('/')
// })

// export the clinicianRouter
module.exports = clinicianRouter