const mongoose = require('mongoose')
const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const Entry = require('../models/entry')
const bcrypt = require('bcrypt')

// display dashboard
const getDashboard = async (req, res, next) => {
    try {
        const user = await Patient.findById(req.user._id).lean();

        // determine if badge should be displayed
        const score = await getEngrt(req.user._id);
        user.badge = (score >= 80);

        // get latest clinician message
        if (user.message) {
            message = user.message.sort(function(a, b) {
                return b.time - a.time
            }).at(-1)
        } else {
            message = false
        }

        // console.log(JSON.stringify(user, null, 4))
        res.render('dashboard', {layout: 'patient.hbs', style:'patient_dashboard.css', patient: user, msg: message})
    }
    catch (err) {
        return next(err)
    }
}

// get all history data for one patient
const getAllData = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.user._id).lean()
        // console.log(JSON.stringify(patient, null, 4))
        const entries = await Entry.find({_patient : req.user._id}).populate('_patient').lean()
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
        const patient = await Patient.findById(req.user._id).lean()
        const entry = await Entry.findOne({_patient : req.user._id, time: {$gt: today}}).lean()

        return res.render('record_data', {layout: 'patient.hbs', style:'record_data.css', data: entry, set: patient.settings})
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
            {_patient : req.user._id, time: {$gt: today}},
            {$set: update},
            {upsert: true})

        const patient = await Patient.findById(req.user._id).lean()
        const entry = await Entry.findOne({_patient : req.user._id, time: {$gt: today}}).lean()

        return res.render('record_data', {layout: 'patient.hbs', style:'record_data.css', data: entry, set: patient.settings, success: true})
    } catch (err) {
        return next(err)
    }
}

// calculate engagement rate of a patient
async function getEngrt(id) {
    const entries = await Entry.find({_patient : id}).lean()
    const start = new Date(mongoose.Types.ObjectId(id).getTimestamp().getTime()).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    const numDays = (today - start) / (24 * 60 * 60 * 1000) + 1;
    const rate = (entries.length / numDays).toFixed(2) * 100;
    return rate;
  }

// get leaderboard
const getLeaderboard = async (req, res, next) => {
    try {
        var patient = await Patient.find({}).lean();
        for (p of patient) {
            // get engagement rate
            const score = await getEngrt(p._id);
            p.score = score
            // add some helper items
            p.isF = (p.gender == "F")
            p.badge = (score >= 80)
        }
        patient = patient
            .sort((a, b) => {
                return b.score - a.score;
            })
            .slice(0, 5);
        // console.log(JSON.stringify(patient, null, 4))
        // add helper rank
        var i = 1;
        for (p of patient) {
            p.rank = i;
            i += 1;
        }
        return res.render('leaderboard', {layout: 'patient.hbs', style: 'leaderboard.css', first: patient[0], others: patient.slice(1, 5)});
    } catch (err) {
        return next(err)
    }
}

const getAllMessages = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.user._id).populate('clinician').lean()
        // console.log(JSON.stringify(patient, null, 4))

        // sort by time
        sorted = patient.message.sort(function(a, b) {
            return b.time - a.time
        })

        // console.log(Intl.DateTimeFormat("en-AU").format(sorted[0].time))

        // change time to more displayable format
        for (m of sorted) {
            m.date = Intl.DateTimeFormat("en-AU").format(m.time);
            m.isF = patient.clinician.gender == "F";
            m.cname = patient.clinician.first_name
        }

        return res.render('history_message', {layout: 'patient.hbs', style: 'history_message.css', message: sorted})
    } catch (err) {
        return next(err)
    }
}
const updatePassword = async (req, res) => {
    try {
      const patient = await Patient.findById(req.user._id);
      if (!(await bcrypt.compare(req.body.old, patient.password))) {
        return res.render("change_password", {
            layout: 'patient.hbs', style: 'change_password.css', warning: "Incorrect Current Password!",
        });
      }
      if (req.body.old == req.body.new) {
        return res.render("change_password", {
            layout: 'patient.hbs', style: 'change_password.css', warning: "New password is the same as old one!",
        });
      }
      if (!(req.body.new == req.body.confirm_new)) {
        return res.render("change_password", {
            layout: 'patient.hbs', style: 'change_password.css', warning: "Please Enter Same Password Twice to Confirm!",
        });
      }
      patient.password = await bcrypt.hash(req.body.confirm_new, 10);
      await patient.save();
      res.render("change_password", { layout: 'patient.hbs', style: 'change_password.css', warning: "Successfully change your password!" });
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
    getDashboard,
    getAllData,
    showForm,
    insertData,
    getLeaderboard,
    getAllMessages,
    updatePassword,
    logout,
} 