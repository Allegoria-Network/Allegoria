'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'mine',
            category: '<:profile:938508980177731604> Profile',
            description: 'Loots resources randomly each 15 minutes',
            options: [],
            example: [],
            checks: { setupProfile: true }
        })
    }

    async run(ctx, userDB) {
        const lastRedeem = userDB.cooldowns.mine ? userDB.cooldowns.mine : 0
        if (Date.now() >= lastRedeem + (1000 * 60 * 15)) {
            const numberCoins = Number(Math.floor(Math.random() * 8).toFixed(0))
            const numberWood = Number(Math.floor(Math.random() * 10).toFixed(0))
            userDB.coins = userDB.coins + Number(numberCoins)
            userDB.wood = userDB.wood + Number(numberWood)
            ctx.reply(` **<:mineria:938500817294590002> Mineria**: Nice! You have collected ressources successfully!: You got **${numberCoins} <:coins:935949762690179133>** and **${numberWood} <:wood:938500833316847738>**! \n\nYou have now a total of **${userDB.coins} <:coins:935949762690179133>**! You need **${userDB.nextLvlCoins-userDB.coins}** more coins to reach the level **${userDB.level+1}**`)
            userDB.cooldowns = { mine: Date.now(), fish: userDB.cooldowns.fish, daily: userDB.cooldowns.daily }
            userDB.mine = userDB.mine === undefined ? 1 : userDB.mine + 1
            if (userDB.coins >= userDB.nextLvlCoins) {
                const message_send = await ctx.interaction.fetchReply().catch(console.error);
                ctx.send({ content: `<:levelup:948273757972230266>> Nice! **${ctx.author.username}**! You have just reached the level **${userDB.level+1}**\n\n<:info:948273758156783646>You have now a bonus of **2%** for the \`daily\` command!`, messageReference: message_send })
                userDB.level = userDB.level + 1;
                userDB.nextLvlCoins = Math.floor(userDB.nextLvlCoins + (125 / 100 * userDB.nextLvlCoins))
                userDB.bonuses = { daily: userDB.bonuses.daily + 2 }
            }
            if (userDB.mine == 1) {
                ctx.database.markQuestCompleted(userDB, "Claim 1 Mine", false, ctx, 5)
                userDB.coins = userDB.coins + 5;
                userDB.completed_quests.push({ name: "Claim 1 Mine", date: Date.now() })
            }
            if (userDB.mine == 10) {
                ctx.database.markQuestCompleted(userDB, "Claim 10 Mine", false, ctx, 10)
                userDB.coins = userDB.coins + 20;
                userDB.completed_quests.push({ name: "Claim 10 Mine", date: Date.now() })
            }
            if (userDB.mine == 150) {
                ctx.database.markQuestCompleted(userDB, "Claim 150 Mine", false, ctx, 200)
                userDB.coins = userDB.coins + 200;
                userDB.completed_quests.push({ name: "Claim 150 Mine", date: Date.now() })
            }
            userDB.save()
        } else {
            const d = moment(lastRedeem + (1000 * 60 * 15));
            const discordDate = `<t:${d.unix()}:R>`;
            return ctx.errorMessage("You've already mined, you need to take a rest. Please come back in " + discordDate + "")
        }
    }

}

module.exports = new Help;