const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const Entry = require('../models/entry')

// get all patient data for clinician
const getAllPatientData = async (req, res, next) => {
    try {
        const patients = await Patient.find().select("_id").lean()
        // console.log(JSON.stringify(result, null, 4))
        const entries = await Entry.find({_patient : {$in: patients.map(a => a._id)}}).populate({path: '_patient', model: Patient}).lean()
        // console.log(JSON.stringify(entries, null, 4))

        for (var i = 0; i < entries.length; ++i) {
            entries[i].highlight = false
            for (const j of ["bgl", "wght", "doses", "steps"]) {
                if (j in entries[i]) {
                    if (entries[i][j].val < entries[i]._patient.settings[`${j}_min`] || entries[i][j].val > entries[i]._patient.settings[`${j}_max`]) {
                        entries[i].highlight = true
                    }
                }
            }
        }

        sorted = entries.sort(function(a, b) {
            return b.time - a.time
        })
        // console.log(JSON.stringify(sorted, null, 4))

        return res.render('clinician-dashboard', { layout: 'clinician.hbs', data: sorted, style:'clinician-dashboard.css'})
    } catch (err) {
        return next(err)
    }
}

// get all history comments for clinician
const getAllComments = async (req, res, next) => {
    try {
        const patients = await Patient.find().select("_id").lean()
        // console.log(JSON.stringify(result, null, 4))
        const entries = await Entry.find({patient : {$in: patients.map(a => a._id)}}).populate({path: '_patient', model: Patient}).lean()
        // console.log(JSON.stringify(entries, null, 4))

        // extract individual comments of each field from entries
        var result = []
        for (var i = 0; i < entries.length; ++i) {
            for (const j of ["bgl", "wght", "doses", "steps"]) {
                if (j in entries[i]) {
                    if ("cmt" in entries[i][j]) {
                        result.push({"first_name": entries[i]._patient.first_name, "last_name": entries[i]._patient.last_name, "cmt": entries[i][j].cmt, "time": entries[i][j].time})
                    }
                }
            }
        }

        // sort by time
        sorted = result.sort(function(a, b) {
            return b.time - a.time
        })

        for (var i = 0; i < sorted.length; ++i) {
            sorted[i].time = Intl.DateTimeFormat("en-AU").format(sorted[i].time)
        }
        // console.log(JSON.stringify(sorted, null, 4))

        return res.render('clinician-comments', { layout: 'clinician.hbs', data: sorted, style:'clinician-comments.css'})
    } catch (err) {
        return next(err)
    }
}

module.exports = { 
    getAllPatientData,
    getAllComments
} 