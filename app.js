// Import express
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport');
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const flash = require('express-flash')
const session = require('express-session')
const utility = require("./routes/patientUtility.js");
// Set your app up as an express app
const app = express()
app.use( bodyParser.urlencoded({ extended: true }) );
require('./passport')(passport);
app.use(flash())
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        saveUninitialized: false,
        resave: false,
        cookie: {maxAge: 300000},
    })
)
// Initialise Passport.js
app.use(passport.initialize())
app.use(passport.session())


app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout:'main',
        extname: 'hbs'
    })
)

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname,'public')))



// link to our router
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')

// patient features
app.use("/patient", patientRouter);
// clinician features
app.use("/clinician", clinicianRouter);

// main login page
app.post('/',
passport.authenticate('patient-strategy', {
    successRedirect: '/patient/dashboard', failureRedirect: '/', failureFlash: true
})
)

app.get('/', utility.unLoggedIn, (req, res) => {
    res.render('login',  {warning: req.flash("error"), patient: true, style:"patient_login.css"})
    
})

// // login page for web size
// app.get('/webp', (req, res) => {
//     res.render('desktoplogin', {patient: true, style:"desktoplogin.css"})
// })

// app.get('/webc', (req, res) => {
//     res.render('desktoplogin', {patient: false, style:"desktoplogin.css"})
// })

app.get('/forgot', (req, res) => {
    res.render('forgot')
})

// about website and about diabetes
app.get('/diabetes', (req, res) => {
    res.render('diabetes', {style:'stylesheet.css', loggedout: true})
})
app.get('/website', (req, res) => {
    res.render('website', {style:'stylesheet.css', loggedout: true})
})


if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}


    
// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('Demo app is listening on port 3000!')
})

    
// link to our router
const { resourceLimits } = require('worker_threads')
require('./models')