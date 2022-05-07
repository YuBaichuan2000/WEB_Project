const mongoose = require('mongoose')
const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const Entry = require('../models/entry')

// get all history data for one patient
const getAllData = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({first_name: "Pat"}).lean()
        // console.log(JSON.stringify(patient, null, 4))
        const entries = await Entry.find({_patient : patient._id}).populate('_patient').lean()
        // console.log(JSON.stringify(entries, null, 4))

        // sort by time
        sorted = entries.sort(function(a, b) {
            return b.time - a.time
        })

        // console.log(Intl.DateTimeFormat("en-AU").format(sorted[0].time))

        // change time to more displayable format
        for (var i = 0; i < sorted.length; ++i) {
            sorted[i].time = Intl.DateTimeFormat("en-AU").format(sorted[i].time)
        }

        patient.data = sorted

        return res.render('history_data', {layout: 'patient.hbs', style: 'history_data.css', patient: patient})
    } catch (err) {
        return next(err)
    }
}

// show form for data entry
const showForm = async (req, res, next) => {
    try {
        return res.render('record_data', {layout: 'patient.hbs', style:'record_data.css'})
    } catch (err) {
        return next(err)
    }
}

// save data to database
const insertData = async (req, res, next) => {
    try {
        // console.log(req.body)
        curtime = new Date().toLocaleString("en-US", {timeZone: 'Australia/Melbourne'})

        var newentry = {}
        for (const i of ["bgl", "wght", "doses", "steps"]) {
            // get each field if entered
            if (req.body[i] != "") {
                newentry[i] = {
                    val: req.body[i],
                    time: curtime
                }
                // get comment if entered
                if (req.body[`${i}cmt`] != "") {
                    newentry[i].cmt = req.body[`${i}cmt`]
                }
            }
        }

        // add to pat the patient for now
        newentry._patient = mongoose.Types.ObjectId("6257ddb12bd8af4ada4ccf86")
        newentry.time = curtime
        
        const newEntry = new Entry(newentry)
        await newEntry.save()
        return
    } catch (err) {
        return next(err)
    }
}

module.exports = { 
    getAllData,
    showForm,
    insertData
} 