const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const Test = mongoose.model('Test', schema)
module.exports = Test