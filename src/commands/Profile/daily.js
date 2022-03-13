'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'daily',
            category: '<:profile:938508980177731604> Profile',
            description: 'Claims your daily money',
            options: [],
            example: [],
            checks: { setupProfile: true }
        })
    }

    async run(ctx, userDB) {
        const lastRedeem = userDB.cooldowns.daily ? userDB.cooldowns.daily : 0
        if (Date.now() >= lastRedeem + (1000 * 60 * 60 * 12)) {
            const pay = Math.floor(Math.random() * (37 - 10 + 1) + 10).toFixed(0)
            const final = ctx.substractChar(userDB, pay).number
            const changed = ctx.substractChar(userDB, pay).sign
            if (userDB.daily === undefined) {
                ctx.database.markQuestCompleted(userDB, "Claim 1 Daily", false, ctx, 5)
                userDB.coins = userDB.coins + 5;
                userDB.completed_quests.push({ name: "Claim 1 Daily", date: Date.now() })
                ctx.reply(`**<:mineria:938500817294590002> Mineria**: Oh Hello **${ctx.author.username}** it's the first time you're there I think... So I will help you this time!\n\nToday you won **${final} <:coins:935949762690179133>** (I ${changed} **${pay-final}<:coins:935949762690179133>** due to your character!)\n\nWant a tip to have more coins? Just [Vote for me](https://allegoria.me/vote) and you will get **15 <:coins:935949762690179133>** additionals coins. You can vote and use this command every 12h. You can see your cooldowns by using \`/cooldowns\``)
            } else {
                if (userDB.daily == 10) {
                    ctx.database.markQuestCompleted(userDB, "Claim 10 Daily", false, ctx, 40)
                    userDB.coins = userDB.coins + 40;
                    userDB.completed_quests.push({ name: "Claim 10 Daily", date: Date.now() })
                }
                if (userDB.daily == 50) {
                    ctx.database.markQuestCompleted(userDB, "Claim 50 Daily", false, ctx, 150)
                    userDB.coins = userDB.coins + 150;

                    userDB.completed_quests.push({ name: "Claim 50 Daily", date: Date.now() })
                }
                if (userDB.daily == 150) {
                    ctx.database.markQuestCompleted(userDB, "Claim 150 Daily", false, ctx, 450)
                    userDB.coins = userDB.coins + 450;
                    userDB.completed_quests.push({ name: "Claim 150 Daily", date: Date.now() })
                }
                ctx.reply(`**<:mineria:938500817294590002> Mineria**: Here is your daily pay: **${final} <:coins:935949762690179133>** (${changed} ${pay-final} due to your character)\n\nWant to boost this sum of **25%** for free and get **15 <:coins:935949762690179133>** additionals coins? [Vote for me](https://allegoria.me/vote) `)
            }
            userDB.coins = userDB.coins + Number(final)
            userDB.daily = userDB.daily === undefined ? 1 : userDB.daily + 1
            userDB.cooldowns = { mine: userDB.cooldowns.mine, fish: userDB.cooldowns.fish, daily: Date.now() }
            userDB.lastRedeems = { mine: userDB.lastRedeems.mine, fish: userDB.lastRedeems.fish, daily: Date.now() }
            if (userDB.coins >= userDB.nextLvlCoins) {
                const message_send = await ctx.interaction.fetchReply().catch(console.error);
                ctx.send({ content: `<:levelup:948273757972230266>> Nice! **${ctx.author.username}**! You have just reached the level **${userDB.level+1}**\n\n<:info:948273758156783646> You have now a bonus of **2%** for the \`daily\` command!`, messageReference: message_send })
                userDB.level = userDB.level + 1;
                userDB.nextLvlCoins = Math.floor(userDB.nextLvlCoins + (125 / 100 * userDB.nextLvlCoins))
                userDB.bonuses = { daily: userDB.bonuses.daily + 2 }
            }
            userDB.save()
        } else {
            const d = moment(lastRedeem + (1000 * 60 * 60 * 12));
            const discordDate = `<t:${d.unix()}:R>`;
            return ctx.errorMessage("You've already redeemed your daily. Please come back in " + discordDate + "")
        }
    }

}

module.exports = new Help;