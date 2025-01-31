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
            var highlight = false
            for (const j of ["bgl", "wght", "doses", "steps"]) {
                if (j in entries[i]) {
                    if (entries[i]._patient.settings[j]) {
                        if (entries[i][j].val < entries[i]._patient.settings[`${j}_min`]) {
                            entries[i][j].low = true
                            highlight = true
                        }
                        if (entries[i][j].val > entries[i]._patient.settings[`${j}_max`]) {
                            entries[i][j].high = true
                            highlight = true
                        }
                    }   
                }
            }
            entries[i].highlight = highlight
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
                        // console.log(JSON.stringify(result, null, 4))
                        result.push({
                            first_name: entries[i]._patient.first_name,
                            last_name: entries[i]._patient.last_name,
                            cmt: entries[i][j].cmt,
                            time: entries[i][j].time,
                            id: entries[i]._patient._id
                        })
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
        const now = new Date()
        const last_week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        // console.log(last_week)

        const entries = await Entry.find({_patient : req.params.id}).populate({path: '_patient', model: Patient}).lean()

        sorted = entries.sort(function(a, b) {
            return b.time - a.time
        })
        
        var lineChart = {
            bgl: [['Date', 'Blood Glucose(nmol/L)']],
            wght: [['Date', 'Weight(Kg)']],
            doses: [['Date', 'Doses Taken']],
            steps: [['Date', 'Steps']],
        }
        for (var i of sorted) {
            if (i.time > last_week) {
                var cur_day = Intl.DateTimeFormat("en-AU").format(i.time).slice(0,5)
                for (j of ["bgl", "wght", "doses", "steps"]) {
                    if (i[j]) {
                        if (i[j].val) {
                            lineChart[j].push([cur_day, Number(i[j].val.toString())])
                        }
                    }
                }
            }
        }

        for (var i = 0; i < sorted.length; ++i) {
            sorted[i].time = Intl.DateTimeFormat("en-AU").format(sorted[i].time)
        }

        return res.render('patient_data.hbs', {datas: JSON.stringify(lineChart), layout: 'clinician.hbs', data: sorted, style:'patient_data.css', id: req.params.id, lineChart: lineChart})
    } catch (err) {
        return next(err)
    }
}

const getSignup = async (req, res, next) => {
    try {
        return res.render("signup", {layout: "clinician.hbs", style:"signup.css"})
    } catch (err) {
        return next(err)
    }
}

// add new patient to database
const insertPatient = async (req, res, next) => {
    try {
        // console.log(req.body)
        if (await Patient.findOne({ email: req.body.email.toLowerCase() })) {
            return res.render("signup", {
                layout: "clinician.hbs",
                style:"signup.css",
                email : 1,
                input: req.body});
        }
        if (await Patient.findOne({ screen_name: req.body.screen_name })) {
            return res.render("signup", {
                layout: "clinician.hbs",
                style:"signup.css",
                screen : 1,
                input: req.body
            });
        }
        if (req.body.gender != "F" && req.body.gender != "M") {
            return res.render("signup", {
                layout: "clinician.hbs",
                style: "signup.css",
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

const getSettings = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id).lean()

        // get latest clinician message
        if (patient.message) {
            message = patient.message.sort(function(a, b) {
                return b.time - a.time
            }).at(-1)
        } else {
            message = false
        }

        return res.render('patient_setting', { layout: 'clinician.hbs', style:'patient_setting.css', id: req.params.id, pat: patient, message: message})
    } catch (err) {
        return next(err)
    }
}

const saveSettings = async (req, res, next) => {
    try {
        curtime = new Date().toLocaleString("en-US", {timeZone: 'Australia/Melbourne'})
        const patient = await Patient.findById(req.params.id).lean()
        

        for (i of ['bgl', 'wght', 'doses', 'steps']) {
            if (req.body[i] == "on") {
                req.body[i] = true;
            } else {
                req.body[i] = false;
            }
        }

        // console.log(JSON.stringify(req.body, null, 4))

        // get clinician's message
        if (req.body.message) {
            const message = {
                msg: req.body.message,
                time: curtime
            }
    
            if (patient.message) {
                patient.message.push(message);
            } else {
                patient.message = [message];
            }
        }

        // console.log(JSON.stringify(patient, null, 4))

        // update settings
        await Patient.updateOne(
            {_id : req.params.id},
            {$set: {
                settings: req.body,
                message: patient.message}})
        // if (message) {
        //     await Patient.updateOne(
        //         {_id : req.params.id},
        //         {$set: {message: message}})
        // }

        return res.redirect(`/clinician/settings/${req.params.id}`)
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
  const updatePassword = async (req, res) => {
    try {
      const clinician = await Clinician.findById(req.user._id);
      if (!(await bcrypt.compare(req.body.old, clinician.password))) {
        return res.render("change_password_c", {
            layout: 'clinician.hbs', style: 'change_password_c.css', warning: "Incorrect Current Password!",
        });
      }
      if (req.body.old == req.body.new) {
        return res.render("change_password_c", {
            layout: 'clinician.hbs', style: 'change_password_c.css', warning: "New password is the same as old one!",
        });
      }
      if (!(req.body.new == req.body.confirm_new)) {
        return res.render("change_password_c", {
            layout: 'clinician.hbs', style: 'change_password_c.css', warning: "Please Enter Same Password Twice to Confirm!",
        });
      }
      clinician.password = await bcrypt.hash(req.body.confirm_new, 10);
      await clinician.save();
      res.render("change_password_c", { layout: 'clinician.hbs', style: 'change_password_c.css', warning: "Successfully change your password!" });
    } catch (err) {
      console.log(err);
      res.send("error happens when update password");
    }
  };

const logout = (req, res) => {
    req.logout();
    res.redirect("/");
};

module.exports = { 
    getAllPatientData,
    getAllComments,
    getOnePatientData,
    getSignup,
    insertPatient,
    getNotes,
    addNote,
    getSettings,
    saveSettings,
    encrypt,
    updatePassword,
    logout
} 