'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-donate',
            category: '<:clan:929660809880141874> Clan',
            description: 'Gives something from your profile to the clan',
            options: [{
                    type: "NUMBER",
                    name: "coins",
                    description: "The amount of money you want to transfer",
                    required: false,
                },
                {
                    type: "NUMBER",
                    name: "wood",
                    description: "The description of the clan you want to create",
                    required: false,
                },

            ],
            example: [],
        })
    }

    async run(ctx, userDB) {
            if (!userDB.done) return ctx.errorMessage("Calm down! You have to complete the configuration of your account! Do `/setup-profile`")
            if (!userDB.clan) return ctx.errorMessage("You are not in a clan yet! You have to be in a clan to use this command")
            const clan = await ctx.database.getClan(userDB.clan)
            const wood = ctx.args.getNumber("wood")
            const coins = ctx.args.getNumber("coins")
            if (!wood && !coins) return ctx.errorMessage("You must provide an amount of coins or of wood")
            if (coins > userDB.coins) return ctx.errorMessage(`You don't have enought to give this amount of coins.`)
            if (wood > userDB.wood) return ctx.errorMessage(`You don't have enought to give this amount of wood.`)
            if (coins) clan.coins = clan.coins + coins, userDB.coins = userDB.coins - coins
            if (wood) clan.ressources = { wood: clan.ressources.wood + wood }, userDB.wood = userDB.wood - wood
            clan.save()
            userDB.save()
            return ctx.successMessage(`You succesfully transfered ${coins ? `**${coins} <:gold_bag:929356637154717697>**`: ""} ${coins && wood ? "and" :""} ${wood ? `**${wood} <:wood:929664990066114570>**`: ""} to [${clan.clanName}](https://allego.me/clan/${clan.clanID})`)

    }
}

module.exports = new Help;