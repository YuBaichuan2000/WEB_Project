const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// Get users
const Patient = require('./models/patient')
const Clinician = require('./models/clinician')
// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
    // Use id to serialize user
    done(undefined, user._id)
})
// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)
passport.deserializeUser((userId, done) => {
    // Run database query here to retrieve user information
    // For now, just return the hardcoded user
    Patient.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})
// Define local authentication strategy for Passport
// http://www.passportjs.org/docs/downloads/html/#strategies
passport.use('patient-strategy',
    new LocalStrategy((email, password, done) => {
        Patient.findOne({ email }, {}, {}, (err, user) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!user) {
                return done(undefined, false, {
                    message: 'Incorrect email or password',
                })
            }
            // Check password
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect email or password',
                    })
                }
                 // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        })
    })       
)

passport.use('clinician-strategy',
    new LocalStrategy((email, password, done) => {
        Clinician.findOne({ email }, {}, {}, (err, user) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!user) {
                return done(undefined, false, {
                    message: 'Incorrect email or password',
                })
            }
            // Check password
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect email or password',
                    })
                }
                 // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        })
    })       
)

// Patient.find({}, (err, users) => {
//     if (users.length > 0) return;
//     Patient.create({ email: 'user', password: 'hashed!', secret: 'INFO30005' }, (err) => {
//         if (err) { console.log(err); return; }
//         console.log('Dummy user inserted')
//     })
// })
    
module.exports = passport