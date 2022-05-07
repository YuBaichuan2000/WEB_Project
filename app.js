// Import express
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const flash = require('express-flash')
const session = require('express-session')


// Set your app up as an express app
const app = express()
app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout:'main',
        extname: 'hbs'
    })
)

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({extended:true}))


app.use(flash())
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        },
    })
)
// Initialise Passport.js
const passport = require('./passport')
app.use(passport.authenticate('session'))

// link to our router
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')

app.use('/clinician', clinicianRouter)
app.use('/patient', patientRouter)


// Load authentication router
// const authRouter = require('./routes/auth')
// app.use(authRouter)

// const MongoStore = require('connect-mongo')
// const mongooseClient = require('./models')
// session({
//     // The secret used to sign session cookies (ADD ENV VAR)
//     secret: process.env.SESSION_SECRET || 'keyboard cat',
//     name: 'demo', // The cookie name (CHANGE THIS)
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         sameSite: 'strict',
//         httpOnly: true,
//         secure: app.get('env') === 'production'
//     },
//     store: MongoStore.create({ clientPromise: mongooseClient }),
// })

// main login page
app.get('/', (req, res) => {
    res.render('login', {style:"patient_login.css"})
})

// login page for web size
app.get('/webp', (req, res) => {
    res.render('desktoplogin', {patient: true, style:"desktoplogin.css"})
})

app.get('/webc', (req, res) => {
    res.render('desktoplogin', {patient: false, style:"desktoplogin.css"})
})

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