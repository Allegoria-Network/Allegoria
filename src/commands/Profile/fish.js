'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'fish',
            category: '<:profile:938508980177731604> Profile',
            description: 'Fishs every hour',
            options: [],
            example: [],
            checks: { setupProfile: true }
        })
    }

    async run(ctx, userDB) {
        const lastRedeem = userDB.cooldowns.fish ? userDB.cooldowns.fish : 0
        if (Date.now() >= lastRedeem + (1000 * 60 * 60)) {
            const numberFish = Number(Math.floor(Math.random() * 10).toFixed(0))
            userDB.poison = userDB.poison + Number(numberFish)
            ctx.reply(` **<:mineria:938500817294590002> Mineria**: Nice! You have fished successfully!: You got **${numberFish} <:fish:935930956458647562>**! \n\nYou have now a total of **${userDB.poison} <:fish:935930956458647562>**!`)
            userDB.cooldowns = { fish: Date.now(), mine: userDB.cooldowns.mine, daily: userDB.cooldowns.daily }
            userDB.fish = userDB.fish === undefined ? 1 : userDB.fish + 1
            if (userDB.fish == 1) {
                ctx.database.markQuestCompleted(userDB, "Claim 1 Fish", false, ctx, 5)
                userDB.coins = userDB.coins + 5;
                userDB.completed_quests.push({ name: "Claim 1 Fish", date: Date.now() })
            }
            if (userDB.fish == 10) {
                ctx.database.markQuestCompleted(userDB, "Claim 10 Fish", false, ctx, 10)
                userDB.coins = userDB.coins + 20;
                userDB.completed_quests.push({ name: "Claim 10 Fish", date: Date.now() })
            }
            if (userDB.fish == 150) {
                ctx.database.markQuestCompleted(userDB, "Claim 150 Fish", false, ctx, 150)
                userDB.coins = userDB.coins + 200;
                userDB.completed_quests.push({ name: "Claim 150 Fish", date: Date.now() })
            }
            userDB.save()
        } else {
            const d = moment(lastRedeem + (1000 * 60 * 60));
            const discordDate = `<t:${d.unix()}:R>`;
            return ctx.errorMessage("You've already fished, you need to take a rest. Please come back in " + discordDate + "")
        }
    }

}

module.exports = new Help;