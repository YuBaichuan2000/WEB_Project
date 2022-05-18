const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: true},
    message: {type: String, required: true},
    screen_name: {type: String, required: true},
    yob: {type: Number, required: true},
    role: {type: String, default: "patient"},
    message: [{
        msg: {type: String, required: true},
        time: {type: Date, required: true}
    }],
    note: [{
        msg: {type: String, required: true},
        time: {type: Date, required: true}
    }],
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

schema.methods.verifyPassword = function (password, callback) {
    // bcrypt.compare(password, this.password, (err, valid) => {
    //     callback(err, valid)
    // })
    compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
} 

// // Password salt factor
// const SALT_FACTOR = 10
// // Hash password before saving
// schema.pre('save', function save(next) {
//     const user = this
//     // Go to next if password field has not been modified
//     if (!user.isModified('password')) {
//         return next()
//     }
//     // Automatically generate salt, and calculate hash
//     bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
//         if (err) {
//             return next(err)
//         }
//         // Replace password with hash
//         user.password = hash
//         next()
//     })
// })

const Patient = mongoose.model('Patient', schema)

module.exports = Patient