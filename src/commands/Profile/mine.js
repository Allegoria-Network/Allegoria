'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'mine',
            category: '<:profile:929660871477706752> Profile',
            description: 'Loots resources randomly each 15 minutes',
            options: [],
            example: [],
            checks: { setupProfile: true }
        })
    }

    async run(ctx, userDB) {
        const lastRedeem = userDB.cooldowns.mine ? userDB.cooldowns.mine : 0
        if (Date.now() >= lastRedeem + (1000 * 60 * 15)) {
            const numberCoins = Number(Math.floor(Math.random() * 10).toFixed(0))
            const numberWood = Number(Math.floor(Math.random() * 10).toFixed(0))
            userDB.coins = userDB.coins + Number(numberCoins)
            userDB.wood = userDB.wood + Number(numberWood)
            ctx.reply(` **<:mineria:929416897311694858> Mineria**: Nice! You have collected ressources successfully!: You got **${numberCoins} <:gold_bag:929356637154717697>** and **${numberWood} <:wood:929664990066114570>**! \n\nYou have now a total of **${userDB.coins} <:gold_bag:929356637154717697>**! You need **${userDB.nextLvlCoins-userDB.coins}** more coins to reach the level **${userDB.level+1}**`)
            userDB.cooldowns = { mine: Date.now(), daily: userDB.cooldowns.daily }
            if (userDB.coins >= userDB.nextLvlCoins) {
                const message_send = await ctx.interaction.fetchReply().catch(console.error);
                ctx.send({ content: `<:levelup:929665911667970119> Nice! **${ctx.author.username}**! You have just reached the level **${userDB.level+1}**\n\n<:infos:929660747859001344> You have now a bonus of **2%** for the \`daily\` command!`, messageReference: message_send })
                userDB.level = userDB.level + 1;
                userDB.nextLvlCoins = Math.floor(userDB.nextLvlCoins + (125 / 100 * userDB.nextLvlCoins))
                userDB.bonuses = { daily: userDB.bonuses.daily + 2 }
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