const mongoose = require('mongoose');
const data = new mongoose.Schema({
    code: { type: String, required: true },
    error: { type: String, required: true },
})
const errorModel = module.exports = mongoose.model('errorModel', data)