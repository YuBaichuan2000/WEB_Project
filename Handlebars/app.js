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

// app.use(express.static(path.join(__dirname,'static')));
app.get('/', (req, res) => {
    //res.sendFile(_dirname+'/static/'+'login.html')
    res.render('login', {style:"patient_login.css"})
})

app.get('/webp', (req, res) => {
    //res.sendFile(_dirname+'/static/'+'login.html')
    res.render('desktoplogin', {patient: true, style:"desktoplogin.css"})
})

app.get('/webc', (req, res) => {
    //res.sendFile(_dirname+'/static/'+'login.html')
    res.render('desktoplogin', {patient: false, style:"desktoplogin.css"})
})

app.get('/forgot', (req, res) => {
    //res.sendFile(_dirname+'/static/'+'login.html')
    res.render('forgot')
})

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
const demoRouter = require('./routes/demoRouter')
const { resourceLimits } = require('worker_threads')
// // the demo routes are added to the end of the '/demo-management' path
app.use('/demo-management', demoRouter)
require('./models')