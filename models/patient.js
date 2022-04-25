const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: true},
    screen_name: {type: String, required: true},
    yob: {type: Number, required: true},
    settings: {
        doses: {type: Boolean, default: true, required: true},
        doses_min: {type: Number, default: 2},
        doses_max: {type: Number, default: 2},
        bgl: {type: Boolean, default: true, required: true},
        bgl_min: {type: mongoose.Types.Decimal128, default: 8},
        bgl_max: {type: mongoose.Types.Decimal128, default: 4},
        exc: {type: Boolean, default: true, required: true},
        exc_min: {type: Number, default: 6000},
        exc_max: {type: Number, default: 5000},
        wght: {type: Boolean, default: true, required: true},
        wght_min: {type: mongoose.Types.Decimal128, default: 80},
        wght_max: {type: mongoose.Types.Decimal128, default: 75},
    },
    clinician: {type: mongoose.Types.ObjectId, ref: 'Clinician'}
})

const Patient = mongoose.model('patient', schema)

module.exports = Patient