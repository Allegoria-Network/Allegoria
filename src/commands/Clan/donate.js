'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-donate',
            category: '<:clan:938506917674889257> Clan',
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
            if (wood && wood <= 0 || coins && coins <= 0) return ctx.errorMessage("Please provide a valid number of wood or coinss.")
            if (!wood && !coins) return ctx.errorMessage("You must provide an amount of coins or of wood")
            if (coins > userDB.coins) return ctx.errorMessage(`You don't have enought to give this amount of coins.`)
            if (wood > userDB.wood) return ctx.errorMessage(`You don't have enought to give this amount of wood.`)
            if (coins) clan.coins = clan.coins + coins, userDB.coins = userDB.coins - coins
            if (wood) clan.ressources = { wood: clan.ressources.wood + wood }, userDB.wood = userDB.wood - wood
            clan.save()
            userDB.save()
            return ctx.successMessage(`You succesfully transfered ${coins ? `**${coins} <:coins:935949762690179133>**`: ""} ${coins && wood ? "and" :""} ${wood ? `**${wood} <:wood:938500833316847738>**`: ""} to [${clan.clanName}](https://allegoria.me/clan/${clan.clanID})`)

    }
}

module.exports = new Help;