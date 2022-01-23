'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'daily',
            category: '<:profile:929660871477706752> Profile',
            description: 'Claims your daily money',
            options: [],
            example: [],
            checks: { setupProfile: true }
        })
    }

    async run(ctx, userDB) {
        const lastRedeem = userDB.cooldowns.daily ? userDB.cooldowns.daily : 0
        if (Date.now() >= lastRedeem + (1000 * 60 * 60 * 24)) {
            const pay = Math.floor(Math.random() * 90).toFixed(0)
            const final = ctx.substractChar(userDB, pay).number
            const changed = ctx.substractChar(userDB, pay).sign
            if (userDB.daily === undefined) {
                ctx.reply(`**<:mineria:929416897311694858> Mineria**: Oh Hello **${ctx.author.username}** it's the first time you're there I think... So I will help you this time!\n\nToday you won **${final} <:gold_bag:929356637154717697>** (I ${changed} **${pay-final}<:gold_bag:929356637154717697>** due to your character!)\n\nWant a tip to have more coins? Just vote for me there: https://allegoria-bot.app/vote and you will get +**25%** so a total sum of **${(125/100 *final).toFixed(0)} <:gold_bag:929356637154717697>**. You can vote and use this command every 24h`)
            } else {
                ctx.reply(`**<:mineria:929416897311694858> Mineria**: Here is your daily pay: **${final} <:gold_bag:929356637154717697>** (${changed} ${pay-final} due to your character)\n\nWant to boost this sum of **25%** for free and get ${(125/100 *final).toFixed(0)} <:gold_bag:929356637154717697>? Just vote for me there: https://allegoria-bot.app/vote `)
            }
            userDB.coins = userDB.coins + Number(final)
            userDB.daily = userDB.daily === undefined ? 1 : userDB.daily + 1
            userDB.cooldowns = { mine: userDB.cooldowns.mine, daily: Date.now() }
            userDB.lastRedeems = { mine: userDB.lastRedeems.mine, daily: Date.now() }
            if (userDB.coins >= userDB.nextLvlCoins) {
                const message_send = await ctx.interaction.fetchReply().catch(console.error);
                ctx.send({ content: `<:levelup:929665911667970119> Nice! **${ctx.author.username}**! You have just reached the level **${userDB.level+1}**\n\n<:infos:929660747859001344> You have now a bonus of **2%** for the \`daily\` command!`, messageReference: message_send })
                userDB.level = userDB.level + 1;
                userDB.nextLvlCoins = Math.floor(userDB.nextLvlCoins + (125 / 100 * userDB.nextLvlCoins))
                userDB.bonuses = { daily: userDB.bonuses.daily + 2 }
            }
            userDB.save()
        } else {
            const d = moment(lastRedeem + (1000 * 60 * 60 * 24));
            const discordDate = `<t:${d.unix()}:R>`;
            return ctx.errorMessage("You've already redeemed your daily. Please come back in " + discordDate + "")
        }
    }

}

module.exports = new Help;