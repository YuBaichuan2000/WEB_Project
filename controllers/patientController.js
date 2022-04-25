const mongoose = require('mongoose')
const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const Entry = require('../models/entry')

const getAllData = async (req, res, next) => {
    try {
        const patients = await Patient.find({first_name: "Pat"}).select("_id").lean()
        // console.log(JSON.stringify(patients, null, 4))
        const entries = await Entry.find({_patient : {$in: patients.map(a => a._id)}}).populate({path: '_patient', model: Patient}).lean()
        // console.log(JSON.stringify(entries, null, 4))

        sorted = entries.sort(function(a, b) {
            return b.time - a.time
        })

        return res.render('patientdata', { data: sorted })
    } catch (err) {
        return next(err)
    }
}

const showForm = async (req, res, next) => {
    try {
        return res.render('enterdata')
    } catch (err) {
        return next(err)
    }
}

const insertData = async (req, res, next) => {
    try {
        curtime = new Date().toLocaleString("en-US", {timeZone: 'Australia/Melbourne'})

        var newentry = {}
        for (const i of ["bgl", "wght", "doses", "steps"]) {
            if (req.body[i] != "") {
                newentry[i] = {
                    val: req.body[i],
                    cmt: req.body[`${i}cmt`],
                    time: curtime
                }
            }
        }

        newentry._patient = mongoose.Types.ObjectId("6257ddb12bd8af4ada4ccf86")
        newentry.time = curtime
        
        const newEntry = new Entry(newentry)
        await newEntry.save()
        return res.redirect('/patient/data')
    } catch (err) {
        return next(err)
    }
}

module.exports = { 
    getAllData,
    showForm,
    insertData
} 