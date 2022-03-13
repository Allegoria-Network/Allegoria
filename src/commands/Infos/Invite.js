'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'invite',
            category: '<:info:948273758156783646> Infos',
            description: 'Sends a link to invite the bot',
            options: [],
            example: [],
        })
    }

    async run(ctx) {
        ctx.reply(
            `**<:mineria:938500817294590002> Mineria**: Heyo **${ctx.author.username}**! want me in your server! Just click [This link](https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https://allegoria.me/auth/login&scope=identify%20guilds+bot&client_id=850080680578383872&permissions=8) and invite me!\n\n*Psst* If you need any help, you can join our [Support Server](https://discord.gg/eZrv2qPj6c)`
        )

    }

}

module.exports = new Help;