'use strict';

const guildData = require("../models/guildData");
const userSchema = require("../models/userSchema");
const errorModel = require("../models/errorModel");
const clanSchema = require("../models/clanSchema")
const users_waiting_battle = []
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
    AddWaitingList(userID) {
        if (!users_waiting_battle.includes(userID)) {
            users_waiting_battle.push(userID)
        } else throw new Error("[AddWaitingList] User is already in waiting list")
        return true;
    }
    RemoveWaitingList(userID) {
        const index = users_waiting_battle.indexOf(userID);
        if (index > -1) users_waiting_battle.splice(index, 1);
        return true;
    }
    checkWaiting(userID) {
        if (users_waiting_battle.includes(userID)) return true
        else return false
    }
    findAdversary(userID) {
        const removed = users_waiting_battle.filter(x => x !== userID)
        if (removed.length == 0) return false
        else {
            const index = users_waiting_battle.indexOf(removed[0]);
            if (index > -1) users_waiting_battle.splice(index, 1);
            return removed[0]
        }
    }
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
            completed_quests: [],
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
    async markQuestCompleted(userDB, questName, save, ctx, reward = {}) {
        if (!userDB) return this._client.logger.error("Please provide userDB")
        if (save == true) {
            userDB.completed_quests.push({ name: questName, date: Date.now() })
            userDB.save()
        }
        ctx.channel.send(`**<:writing:948271792747855873> New quest unlocked**\n\n**<:mineria:938500817294590002> Mineria**: Congrats **${ctx.author.username}** you have just completed your ${(userDB.completed_quests.length+1)}${(userDB.completed_quests.length+1) ==0?"st":(userDB.completed_quests.length+1) ==2?"nd":"th"} quest: **${questName}**\n\n__Your reward__: **${reward} <:coins:935949762690179133>**`)
    }
    async registerError(code, error) {
        new errorModel({
            code: code,
            error: error
        }).save();
    }
}

module.exports = DbManager;