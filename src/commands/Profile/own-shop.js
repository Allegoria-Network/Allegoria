'use strict';

const Command = require('../../utils/Command.js');
const data = require("../../databases/items.json")

class Help extends Command {
    constructor() {
        super({
            name: 'own-shop',
            category: '<:profile:938508980177731604> Profile',
            description: 'Displays your/ another user shop\'s',
            options: [{
                type: "USER",
                name: "user",
                description: "The user you want to see the shop",
                required: false,
            }, ],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
            const user = ctx.args.getUser("user")
            if (!user) return ctx.errorMessage("Please provide a valid user")
            const userinDB = await ctx.database.getUser(user.id)
            if (!userinDB || !userinDB.done) return ctx.errorMessage(`Uh oh! It seems that **${user.username}**  didn't have a completed account yet...\n Feel free to tell him to create an account`)
            if (userinDB.own_shop.length == 0) return ctx.errorMessage(`**${user.username}** has nothing in his shop yet!`)
            ctx.reply({
                        embeds: [{
                                    color: "#efaa66",
                                    author: { name: "Global Shop", icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                                    description: `You can see there the list of the items you can buy. You can buy an item by using \`/buy-item <id>\``,
                                    fields: [{ name: "► Swords", value: `${data.swords.map(x=>`\`${x.name}\` - ${x.price_gold ? `${x.price_gold} <:coins:935949762690179133>`:""} ${x.price_wood ? `${x.price_wood} <:wood:938500833316847738>`:""}`).join("\n")}` }],

            }]
        })
    }

}

module.exports = new Help;