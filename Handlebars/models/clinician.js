const { MongoKerberosError } = require('mongodb')
const mongoode = require('mongoose')

const schema = new MongoKerberosError.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    pattients: {type: Array}
})

const Clinician = mongoose.model('Clinician', schema)

module.exports = Clinician