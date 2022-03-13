'use strict';

const Command = require('../../utils/Command.js');
const data = require("../../databases/items.json")

class Help extends Command {
    constructor() {
        super({
            name: 'shop',
            category: '<:profile:938508980177731604> Profile',
            description: 'Displays the shop',
            options: [{
                type: "STRING",
                name: "item",
                description: "The name/id of an item to get more informations about it",
                required: false,
            }, ],
            example: [],
            checks: { setupProfile: true }

        })
    }
    async run(ctx, userDB) {
            if (ctx.args.getString("item")) {
                const item = data.items.find(x => x.name === ctx.args.getString("item") || x.id === ctx.args.getString("item"))
                if (!item) return ctx.errorMessage(`Please provide a valid item name.`)
                ctx.reply({
                    embeds: [{
                        color: "#efaa66",
                        description: item.description,
                        author: { name: item.name, icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                        fields: [{ name: "► General", inline: true, value: `Price: ${item.price_gold} <:coins:935949762690179133> | ${item.price_wood} <:wood:938500833316847738>\nDamage: ${item.damage}\nProtection: ${item.protection}\nEnd time: ${item.end_time}` }],

                    }]
                })
            }
            ctx.reply({
                        embeds: [{
                                    color: "#efaa66",
                                    author: { name: "Global Shop", icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                                    fields: data.categories.map(x => {
                                                return {
                                                    name: `► ${x}`,

                                                    inline: true,
                                                    value: data.items.filter(xe => xe.category === x).map(x => `[${x.name}](https://discord.gg/r8fVHdh5TD)\n• Price: ${x.price_gold ? `${x.price_gold} <:coins:935949762690179133>`:""} ${x.price_wood ? `${x.price_wood} <:wood:938500833316847738>`:""}`).join("\n")
                    };
                }),

            }]
        })
    }

}

module.exports = new Help;