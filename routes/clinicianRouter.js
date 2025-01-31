const express = require('express')
const passport = require('passport')
const clinicianRouter = express.Router()
const clinicianController = require('../controllers/clinicianController')
const utility = require("./clinicianUtility.js");

// Handle login
clinicianRouter.post('/webc',
    passport.authenticate('clinician-strategy', {
        successRedirect: '/clinician/dashboard', failureRedirect: '/clinician/webc', failureFlash: true
    })
)

clinicianRouter.get('/webc', utility.unLoggedIn, (req, res) => {
    res.render('desktoplogin', {warning: req.flash('error'), patient: false, style:"desktoplogin.css"})
})

clinicianRouter.get("/updatePassword", utility.isLoggedIn, (req, res) => {
    res.render('change_password_c',{layout: 'clinician.hbs', style: 'change_password_c.css'})  
})
clinicianRouter.post("/updatePassword", utility.isLoggedIn, clinicianController.updatePassword);

// GET all patients' data and comments
clinicianRouter.get('/dashboard', utility.isLoggedIn, clinicianController.getAllPatientData)

clinicianRouter.get('/comments', utility.isLoggedIn, clinicianController.getAllComments)

// sign up new patient
clinicianRouter.get("/signup", utility.isLoggedIn, clinicianController.getSignup)
clinicianRouter.post('/signup', clinicianController.insertPatient)

clinicianRouter.get("/logout", utility.isLoggedIn, clinicianController.logout);
// get entries of one patient
clinicianRouter.get("/:id", utility.isLoggedIn, clinicianController.getOnePatientData)

// enter clinical notes for one patient
clinicianRouter.get("/notes/:id", utility.isLoggedIn, clinicianController.getNotes)
clinicianRouter.post("/notes/:id", clinicianController.addNote)

clinicianRouter.get("/settings/:id", utility.isLoggedIn, clinicianController.getSettings)
clinicianRouter.post("/settings/:id", clinicianController.saveSettings)

// clinicianRouter.get('/test', (req, res) => {
//     res.render('signupnewpatient.hbs', {layout: 'clinician.hbs', style:'signupnewpatient.css'})
// })

// clinicianRouter.post("/encrypt", clinicianController.encrypt);


// export the clinicianRouter
module.exports = clinicianRouter