'use strict';

const Command = require('../../utils/Command.js');
const data = require("../../databases/items.json")

class Help extends Command {
    constructor() {
        super({
            name: 'inventory',
            category: '<:profile:938508980177731604> Profile',
            description: 'Displays your inventory',
            options: [{
                type: "SUB_COMMAND",
                name: "view",
                description: "Views your inventory",
                required: false,
            }, {
                type: "SUB_COMMAND",
                name: "sell",
                description: "Sells all you ressource",
                required: false,
            }, ],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
            let subCommand = ctx.interaction.options.getSubcommand();
            if (subCommand === "view" || !subCommand) {
                if (userDB.items.length !== 0) {
                    const userItems = new Map()
                    userDB.items.forEach(item => {
                        if (!userItems.has({ name: data.items.find(x => x.id == item).name })) userItems.set({ name: data.items.find(x => x.id == item).name, count: 1 })
                        else {

                        }
                    });
                }
                ctx.reply({
                            embeds: [{
                                        color: "#efaa66",
                                        description: `You have a total of **${userDB.items.length}** items in your inventory!`,
                                        author: { name: "Your inventory", icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                                        fields: [{ name: "<:chest:948275115605504030>  Items ", value: `${userDB.items.length==0?"You don't have any item in your inventory yet." : userDB.items.map(item=>`• [${ data.items.find(x => x.id == item).name}](https://discord.gg/r8fVHdh5TD)`).join("\n")}` },{ name: "<:treasure:948275553788633128> Ressources ", value: `Coins: ${userDB.coins}\nWood: ${userDB.wood}\nFish: ${userDB.poison}` }],

            }]
        })
    }else{
        userDB.coins = userDB.coins + (userDB.fish *3) + (userDB.wood*2)
        console.log(`${(userDB.fish *3) + (userDB.wood*2)}`)
        ctx.successMessage(`You have sellt your ressources successfuly and you won **${(userDB.fish *3) + (userDB.wood*2)} <:coins:935949762690179133>**`)
        userDB.fish=0;
        userDB.wood=0;
        if (userDB.coins >= userDB.nextLvlCoins) {
            ctx.send({ content: `<:levelup:948273757972230266>> Nice! **${ctx.author.username}**! You have just reached the level **${userDB.level+1}**\n\n<:info:948273758156783646>You have now a bonus of **2%** for the \`daily\` command!` })
            userDB.level = userDB.level + 1;
            userDB.nextLvlCoins = Math.floor(userDB.nextLvlCoins + (125 / 100 * userDB.nextLvlCoins))
            userDB.bonuses = { daily: userDB.bonuses.daily + 2 }
        }
        userDB.save()
    }
}
}

module.exports = new Help;