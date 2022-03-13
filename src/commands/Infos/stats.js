'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'stats',
            category: '<:info:948273758156783646> Infos',
            description: 'Gives some informations about the bot',
            options: [],
            example: ['help', 'help botinfo'],
        })
    }

    async run(ctx) {
        let guildsCounts = await ctx.client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p + count);
        let a = await ctx.client.shard.fetchClientValues("users.cache.size");
        let b = a.reduce((p, count) => p + count);
        console.log(`Shard ID: ${ctx.client.shard.ids[0]}`)
        ctx.reply({
            embeds: [{

                color: "#efaa66",
                author: { name: "Allegoria - informations", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                footer: { text: `Allegoria - All rights reserved`, icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }) },
                description: "• Hello! I am a very user friendly game discord bot! I'm provided by [Green-bot](https://green-bot.app/team)\n\n**• Statistics**\n Servers: " + guildsCount.toLocaleString() + "\nUsers: " + b.toLocaleString() * 100 + "\nCommands: " + ctx.client.commands.commands.size + " \n\n**• Informations**\n Owner: [Green-bot](https://green-bot.app)\nDevelopers: <@688402229245509844>, <@772850214318768138>",
            }]
        })

    }

}

module.exports = new Help;