const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    clanID: { type: String, required: true },
    clanName: { type: String, required: true },
    discord_server: { type: String, required: false },
    description: { type: String, required: false },
    welcome_message: { type: String, required: false },
    creation_date: { type: Date, required: false, default: Date().now },
    private: { type: Boolean, required: false, default: false },
    verified_clan: { type: Boolean, required: false },
    coins: { type: Number, required: false },
    ressources: { type: Object, required: false, default: 0 },
    clan_owner: { type: String, required: false, default: false },
    admins: { type: Array, required: false, default: false },
    members: { type: Array, required: false, default: false },
    members_banned: { type: Array, required: false, default: [] },
    entry_price: { type: Number, required: false, default: false },
    min_level: { type: Number, required: false, default: false },

})
const userSchema = module.exports = mongoose.model('clanSchema', channeldb)