const mongoose = require('mongoose')
const Patient = require('../models/patient')

const schema = new mongoose.Schema({
    bgl: {
        val: mongoose.Types.Decimal128,
        cmt: String,
        time: Date,
    },
    wght: {
        val: mongoose.Types.Decimal128,
        cmt: String,
        time: Date,
    },
    doses: {
        val: Number,
        cmt: String,
        time: Date,
    },
    steps: {
        val: Number,
        cmt: String,
        time: Date,
    },
    _patient: {type: mongoose.Types.ObjectId, ref: 'Patient'},
    time: Date
})

const Entry = mongoose.model('entry', schema)

module.exports = Entry