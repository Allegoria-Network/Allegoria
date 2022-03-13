'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'premium',
            category: '<:info:948273758156783646> Infos',
            description: 'Go premium',
            options: [],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
        ctx.reply({
            embeds: [{
                color: "#efaa66",
                author: { name: "Allegoria premium", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                description: `Purchasing a [Premium membership](https://allegoria.me/premium) is a great way to get a boost ahead!\n\nThere are **4** premiums plan: Bronze, Silver, Gold and God. you can purchase these plans by cliking [there](https://allegoria.me/premium/buy)\nEach plan gives a random number of each ressources. You can also boost your level number`,
            }]
        })
    }

}

module.exports = new Help;