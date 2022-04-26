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
    res.render('login',{style:"patient_login.css"})
})
app.get('/forgot', (req, res) => {
    //res.sendFile(_dirname+'/static/'+'login.html')
    res.render('forgot')
})
// app.get('/dashboard', (req, res) => {
//     res.render('dashboard', {style:'patient_dashboard.css',Username:'Pat'})
// })
// app.get('/hamburger', (req, res) => {
//     res.render('hamburger', {Username:'Pat'})
// })
app.get('/diabetes', (req, res) => {
    res.render('diabetes',{style:'stylesheet.css'})
})
app.get('/website', (req, res) => {
    res.render('website',{style:'stylesheet.css'})
})
// app.get('/record_data', (req, res) => {
//     res.render('record_data',{style:'record_data.css'})
// })
// app.get('/history_data', (req, res) => {
//     // add mongodb
//     res.render('history_data', {style:'history_data.css', patient:{
//         'name': 'Ye',
//         'data': [{'Date':'11','Glucose':'11','Weight':'11','Doses':'1','Step':'1'}]
//     }})
// })

// app.get('/history_data/:id', (req, res) => {
//     //res.sendFile(_dirname+'/static/'+'login.html')
//     // add mongodb
//     res.render('history_data', {patient:{
//         'name': 'Ye',
//         'data': result
//     }}, {pageid:req.params.id})
// })
// app.get('/leaderboard', (req, res) => {
//     res.render('leaderboard')
// })
// app.get('/messages', (req, res) => {
//     res.render('messages')
// })


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