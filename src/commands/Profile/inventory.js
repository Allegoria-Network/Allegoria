'use strict';

const Command = require('../../utils/Command.js');
const data = require("../../databases/items.json")

class Help extends Command {
    constructor() {
        super({
            name: 'inventory',
            category: '<:profile:929660871477706752> Profile',
            description: 'Displays your inventory',
            options: [],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
            if (userDB.items.length == 0) return ctx.errorMessage(`You have nothing in your inventory yet.`)
            const userItems = new Map()
            userDB.items.forEach(item => {
                if (!userItems.has({ name: data.items.find(x => x.id == item).name })) userItems.set({ name: data.items.find(x => x.id == item).name, count: 1 })
                else {

                }
            });
            ctx.reply({
                        embeds: [{
                                    color: "#efaa66",
                                    description: `You have a total of **${userDB.items.length}** items in your inventory!`,
                                    author: { name: "Your inventory", icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                                    fields: [{ name: "<:chest:929355582132092948>  Items ", value: `${userDB.items.map(item=>`• [${ data.items.find(x => x.id == item).name}](https://discord.gg/6wa4U5sAMe)`).join("\n")}` }],

            }]
        })
    }

}

module.exports = new Help;