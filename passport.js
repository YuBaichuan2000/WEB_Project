const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
//const bcrypt = require("bcrypt");
// Get users
const Patient = require('./models/patient')
const Clinician = require('./models/clinician')


//Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
    // Use id to serialize user
    done(null, {_id: user._id, role:user.role})
})
//When a request comes in, deserialize/expand the serialized information
//back to what it was (expand from id to full user)
// passport.deserializeUser((login, done) => {
//     // Run database query here to retrieve user information
//     // For now, just return the hardcoded user
//     if (login.role === "patient"){
//         Patient.findById(login._id, (err, user) => {
//             return done(err, user)
//         })
//     }  
//     else{
//         return done("This user does not have a role", null)
//     }
// })
passport.deserializeUser((userId, done) => {
    Patient.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
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
                Patient.findOne({'email':email.toLowerCase()}, async(err,patient) => {
                    if (err) {
                        return done(err);
                    }
                    else if(!patient){
                        return done(null, false, req.flash('warning','No user found'));
                    }
                    else if (!(password == patient.password)){
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
                Clinician.findOne({'email':email.toLowerCase()}, async(err,clinician) => {
                    if (err) {
                        return done(err);
                    }
                    else if(!clinician){
                        return done(null, false, req.flash('loginMessage','No user found'));
                    }
                    else if (!(password == clinician.password)){
                        return done(null, false, req.flash('loginMessage','Wrong password'));
                    }
                    else{
                        return done(null, clinician, req.flash('loginMessage', 'Login successful'));
                    }
            });
        })
    })
)
module.exports = passport