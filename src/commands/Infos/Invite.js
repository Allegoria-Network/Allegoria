'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'invite',
            category: '<:infos:929660747859001344> Infos',
            description: 'Sends a link to invite the bot',
            options: [],
            example: [],
        })
    }

    async run(ctx) {
        ctx.reply({
            embeds: [{
                color: "#efaa66",
                author: { name: "Add me to your server", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                description: "Heyo! Want me in your server? Click [This link](https://discord.com/oauth2/authorize?client_id=850080680578383872&response_type=code&permissions=17180256320&scope=applications.commands+bot)\nNeed help? Come on on our [Guild](https://discord.gg/6wa4U5sAMe)",
            }]
        })

    }

}

module.exports = new Help;