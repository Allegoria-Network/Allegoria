'use strict';

const guildData = require("../models/guildData");
const userSchema = require("../models/userSchema");
const errorModel = require("../models/errorModel");
const clanSchema = require("../models/clanSchema")
class DbManager {
    constructor(client) {
        this._client = client;
    }
    uniqID(Charlength = {}) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = Charlength;
        var randomstring = '';
        for (var x = 0; x < string_length; x++) {
            var letterOrNumber = Math.floor(Math.random() * 2);
            if (letterOrNumber == 0) {
                var newNum = Math.floor(Math.random() * 9);
                randomstring += newNum;
            } else {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }
        }
        return randomstring
    };
    async getClan(clanID) {
        let data = await clanSchema.findOne({ clanID: clanID })
        if (!data) {
            await clanSchema.findOne({ clanName: clanID })
        }
        return data;
    }
    async insertClan(data, generateID = {}) {
        if (generateID === true) data.clanID = this.uniqID(3)
        new clanSchema(data).save()
        return true
    }
    async pruneClan(clanID) {
        let data = await clanSchema.findOne({ clanID: clanID })
        data.members.forEach(async m => {
            const d = await this.getUser(m)
            d.clan = null
            d.save()
        })
        clanSchema.findOneAndDelete({ clanID: clanID })
    }
    async getServer(serverID) {
        let data = await guildData.findOne({ serverID: serverID })
        if (!data) {
            data = await new guildData({
                serverID: serverID,
                lang: "en",
                color: "#3A871F",
            }).save()
        }
        return data;
    }
    async insertUser(member) {
        const data = await new userSchema({
            userID: member.id,
            nickname: member.user.username,
            accepted: false,
            join_date: Date.now(),
            coins: 0,
            wood: 0,
            level: 0,
            bonuses: {
                daily: 0,
                mine: null,
            },
            cooldowns: {
                daily: null,
                mine: null,
            },
            nextLvlCoins: 150,
            lastRedeems: {
                daily: null,
                mine: null,
            },
            pets: [],
        }).save()
        return data;
    }
    async pruneUser(member) {
        return userSchema.findOneAndDelete({ userID: member.id })
    }
    async getUser(memberID) {
        console.log("Get user")
        let data = await userSchema.findOne({ userID: memberID })
        return data;
    }

    async registerError(code, error) {
        new errorModel({
            code: code,
            error: error
        }).save();
    }
}

module.exports = DbManager;