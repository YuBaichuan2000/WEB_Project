const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const Clinician = mongoose.model('Clinician', schema)

module.exports = Clinician