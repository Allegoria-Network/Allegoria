const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    serverID: { type: String, required: true },
    prefix: { type: String, required: true, default: "*" },
    lang: { type: String, required: false, default: "en" },
    admin_role: { type: String, required: false, default: null },
    auto_duplicates: { type: Boolean, required: false, default: false },
    auto_autoplay: { type: Boolean, required: false, default: false },
    goodPremium: { type: String, required: false, default: null },
    requestChannel: { type: String, required: false, default: null },
    requestMessage: { type: String, required: false, default: null },
    defaultVolume: { type: String, required: false, default: 60 },
    vc: { type: String, required: false, default: null },
    auto_shuffle: { type: String, required: false, default: null },
    dj_role: { type: String, required: false, default: null },
    color: { type: String, required: false, default: "#3A871F" },
    song: { type: String, required: false, default: null },
    h24: { type: String, required: false, default: null },
    announce: { type: String, required: false, default: true },
    h24Channel: { type: String, required: false, default: null },
})
const guildData = module.exports = mongoose.model('guildData', channeldb)