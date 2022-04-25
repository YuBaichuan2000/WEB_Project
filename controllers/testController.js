const Test = require('../models/test')

const getAllTestData = async (req, res, next) => {
    try {
        const test = await Test.find().lean()
        return res.render('test', { data: test })
    } catch (err) {
        return next(err)
    }
}

module.exports = { 
    getAllTestData,
} 