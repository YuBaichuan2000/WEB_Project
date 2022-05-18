const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require("bcrypt");
// Get users
const Patient = require('./models/patient')
const Clinician = require('./models/clinician')
const bcrypt = require('bcrypt')

module.exports = (passport) => {
    //Serialize information to be stored in session/cookie
    passport.serializeUser((user, done) => {
        // Use id to serialize user
        done(null, {_id: user._id, role:user.role})
    })
    //When a request comes in, deserialize/expand the serialized information
    //back to what it was (expand from id to full user)
    passport.deserializeUser((login, done) => {
        if (login.role === "patient") {
          Patient.findById(login._id, (err, user) => {
            return done(err, user)
          })
        } 
        else if (login.role === "clinician"){
            Clinician.findOne(login._id, (err, user) => {
                return done(err, user)
            })
        }
        else {
          return done("This user does not have role", null)
        }
      })
    
    //Define local authentication strategy for Passport
    passport.use('patient-strategy',
        new LocalStrategy(
            {
                usernameField:"email",
                passwordField:"password",
                passReqToCallback: true
            },
            (req, email, password, done) => {
                process.nextTick(() => {
                    Patient.findOne({'email':email}, async(err,patient) => {
                        if (err) {
                            return done(err);
                        }
                        else if(!patient){
                            return done(null, false, req.flash('warning','No user found'));
                        }
                        else if (!await bcrypt.compare(password, patient.password)) {
                            return done(null, false, req.flash('warning','Wrong password'));
                        }
                        else{
                            return done(null, patient, req.flash('warning', 'Login successful'));
                        }
                });
            })
        })
    )
    
    //Define local authentication strategy for Passport
    passport.use('clinician-strategy',
        new LocalStrategy(
            {
                usernameField:"email",
                passwordField:"password",
                passReqToCallback: true
            },
            (req, email, password, done) => {
                process.nextTick(() => {
                    Clinician.findOne({'email':email}, async(err,clinician) => {
                        if (err) {
                            return done(err);
                        }
                        else if(!clinician){
                            return done(null, false, req.flash('warning','No user found'));
                        }
                        else if (!await bcrypt.compare(password, clinician.password)) {
                            return done(null, false, req.flash('warning','Wrong password'));
                        }
                        else{
                            return done(null, clinician, req.flash('warning', 'Login successful'));
                        }
                });
            })
        })
    )
}
