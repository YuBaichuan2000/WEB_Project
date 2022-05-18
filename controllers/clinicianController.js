const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const Entry = require('../models/entry')
const bcrypt = require("bcrypt")

// get all patient data for clinician
const getAllPatientData = async (req, res, next) => {
    try {
        const patients = await Patient.find({clinician: req.user.id}).select("_id").lean()
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
        const patients = await Patient.find({clinician: req.user._id}).select("_id").lean()
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

const getOnePatientData = async (req, res, next) => {
    try {
        const entries = await Entry.find({_patient : req.params.id}).populate({path: '_patient', model: Patient}).lean()
        sorted = entries.sort(function(a, b) {
            return b.time - a.time
        })
        return res.render('patient_data', { layout: 'clinician.hbs', data: sorted, style:'patient_data.css'})
    } catch (err) {
        return next(err)
    }
}

// add new patient to database
const insertPatient = async (req, res, next) => {
    try {
        // console.log(req.body)
        if (await Patient.findOne({ email: req.body.email.toLowerCase() })) {
            return res.render('signup', {
                layout: 'clinician.hbs',
                style:'signup.css',
                email : 1,
                input: req.body});
        }
        if (await Patient.findOne({ screen_name: req.body.screen_name })) {
            return res.render('signup', {
                layout: 'clinician.hbs',
                style:'signup.css',
                screen : 1,
                input: req.body
            });
        }
        if (req.body.gender != "F" && req.body.gender != "M") {
            return res.render('signup', {
                layout: 'clinician.hbs',
                style:'signup.css',
                gender : 1,
                input: req.body
            });
        }
        var patient = req.body
        patient.clinician = req.user._id

        if (patient.message != "") {
            curtime = new Date().toLocaleString("en-US", {timeZone: 'Australia/Melbourne'})
            patient.message = [{
                msg: patient.message,
                time: curtime
            }]
        }

        // add hashed passwords
        patient.password = await bcrypt.hash(req.body.password, 10)

        const newPatient = new Patient(patient)
        await newPatient.save()
        return res.redirect("/clinician/dashboard")
    } catch (err) {
        return next(err)
    }

}

const getNotes = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id).lean()
        // console.log(JSON.stringify(patient, null, 4))

        // sort by time
        if (patient.note) {
            sorted = patient.note.sort(function(a, b) {
                return b.time - a.time
            })
        } else {
            sorted = []
        }

        // console.log(JSON.stringify(sorted, null, 4))

        // console.log(Intl.DateTimeFormat("en-AU").format(sorted[0].time))

        // change time to more displayable format
        for (n of sorted) {
            n.date = Intl.DateTimeFormat("en-AU").format(n.time);
        }

        return res.render('clinician_notes', { layout: 'clinician.hbs', data: sorted, style:'clinician_notes.css', id: req.params.id})
    } catch (err) {
        return next(err)
    }
}

const addNote = async (req, res, next) => {
    try {
        curtime = new Date().toLocaleString("en-US", {timeZone: 'Australia/Melbourne'})
        const patient = await Patient.findById(req.params.id).lean()
        // console.log(JSON.stringify(req.body, null, 4))

        const note = {
            msg: req.body.note,
            time: curtime
        }

        if (patient.note) {
            patient.note.push(note);
        } else {
            patient.note = [note];
        }

        await Patient.updateOne(
            {_id : req.params.id},
            {$set: {note: patient.note}})
        
        return res.redirect(`/clinician/notes/${req.params.id}`)
    } catch (err) {
        return next(err)
    }
}

// use this function only if your password is plain text in your db!!!!
const encrypt = async (req, res) => {
    try {
      const clinicianId = "6283a31c8a0376b49bb56216";
      const clinician = await Clinician.findOne({'_id':clinicianId});
      const salt = await bcrypt.genSalt(10);
      console.log(clinician.password);
      clinician.password = await bcrypt.hash(clinician.password, salt);
      await clinician.save();
      res.send("password encrypted");
    } catch (err) {
      console.log(err);
      res.send("error happens when encrypt password");
    }
  };

module.exports = { 
    getAllPatientData,
    getAllComments,
    getOnePatientData,
    insertPatient,
    getNotes,
    addNote,
    encrypt
} 