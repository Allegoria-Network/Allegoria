const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    userID: { type: String, required: true },
    tier: { type: String, required: true },
    guildsleft: { type: Number, required: true },
    expires: { type: Date, required: false },
    premiumGuilds: { type: Array, require: false },
})
const premiumUser = module.exports = mongoose.model('premiumUser', channeldb)