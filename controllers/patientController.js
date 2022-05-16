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
        today = new Date();
        today.setHours(0,0,0,0);
        const patient = await Patient.findOne({first_name: "Pat"}).lean()
        const entry = await Entry.findOne({_patient : patient._id, time: {$gt: today}}).lean()

        return res.render('record_data', {layout: 'patient.hbs', style:'record_data.css', data: entry})
    } catch (err) {
        return next(err)
    }
}

// save data to database
const insertData = async (req, res, next) => {
    try {
        // console.log(req.body)
        today = new Date();
        today.setHours(0,0,0,0);

        console.log(JSON.stringify(req.body, null, 4))

        const patient = await Patient.findOne({first_name: "Pat"}).lean()

        curtime = new Date().toLocaleString("en-US", {timeZone: 'Australia/Melbourne'})

        var update = {}
        for (const i of ["bgl", "wght", "doses", "steps"]) {
            if (req.body[i] != "") {
                update[`${i}.val`] = req.body[i]

                // add comment if entered
                if (req.body[`${i}cmt`] != "") {
                    update[`${i}.cmt`] = req.body[`${i}cmt`]
                    update[`${i}.time`] = curtime
                }
            }
        }
        // update overall time
        update.time = curtime
        await Entry.updateOne(
            {_patient : patient._id, time: {$gt: today}},
            {$set: update},
            {upsert: true})
        return
    } catch (err) {
        return next(err)
    }
}

// get all history data for one patient
const getLeaderboard = async (req, res, next) => {
    try {
        return res.render('leaderboard', {layout: 'patient.hbs', style: 'leaderboard.css'})
    } catch (err) {
        return next(err)
    }
}

module.exports = { 
    getAllData,
    showForm,
    insertData,
    getLeaderboard
} 