// Import express
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const res = require('express/lib/response')

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

// link to our router
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')

app.use('/clinician', clinicianRouter)
app.use('/patient', patientRouter)

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


// Tells the app to listen on port 3000 and logs that information to the
//console.
app.listen(process.env.PORT || 3000, () => { 
    console.log('The library app is running!') 
})

// link to our router
const { resourceLimits } = require('worker_threads')
require('./models')