'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'give',
            category: '<:profile:929660871477706752> Profile',
            description: 'Gives something from your profile to another user',
            options: [{
                    type: "USER",
                    name: "user",
                    description: "The user who you want to transfer money",
                    required: true,
                }, {
                    type: "NUMBER",
                    name: "coins",
                    description: "The amount of money you want to transfer",
                    required: false,
                },
                {
                    type: "NUMBER",
                    name: "wood",
                    description: "The amount of wood you want to transfer",
                    required: false,
                },
                {
                    type: "NUMBER",
                    name: "diamants",
                    description: "The amount of diamants you want to transfer",
                    required: false,
                },

            ],
            example: [],
            checks: { setupProfile: true }
        })
    }

    async run(ctx, userDB) {
            const user = ctx.args.getUser("user")
            if (!user) return ctx.errorMessage("Please provide a valid user")
            const wood = ctx.args.getNumber("wood")
            const coins = ctx.args.getNumber("coins")
            const diamants = ctx.args.getNumber("diamants")
            if (!wood && !coins && !diamants) return ctx.errorMessage("You must provide an amount of coins or of wood")
            const userinDB = await ctx.database.getUser(user.id)
            if (!userinDB || !userinDB.done) return ctx.errorMessage(`Uh oh! It seems that **${user.username}**  didn't have a completed account yet...\n Feel free to tell him to create an account`)
            if (coins > userDB.coins) return ctx.errorMessage(`You don't have enought to give this amount of coins.`)
            if (wood > userDB.wood) return ctx.errorMessage(`You don't have enought to give this amount of wood.`)
            if (diamants > userDB.diamants) return ctx.errorMessage(`You don't have enought to give this amount of diamants.`)
            if (coins) userinDB.coins = userinDB.coins + coins, userDB.coins = userDB.coins - coins
            if (wood) userinDB.wood = userinDB.wood + wood, userDB.wood = userDB.wood - wood
            if (diamants) userinDB.diamants = userinDB.diamants + diamants, userDB.diamants = userDB.diamants - wood
            userinDB.save()
            userDB.save()
            return ctx.successMessage(`You succesfully transfered ${coins ? `**${coins} <:gold_bag:929356637154717697>**`: ""} ${coins && wood && diamants  ? "," :coins && diamants?"and":""}${diamants?`${diamants} <:diamond:929356286460588063>` :""} ${coins && wood && diamants  ? "and" :coins && wood ? "and": diamants && wood ? "and": ""} ${wood ? `**${wood} <:wood:929664990066114570>**`: ""} to [${user.username}](https://allego.me/u/${user.id})`)

    }
}

module.exports = new Help;