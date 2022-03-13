'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'vote',
            category: '<:info:948273758156783646> Infos',
            description: 'Votes the bot every 12h',
            options: [],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
        if (userDB.vote_count == 0) {
            ctx.reply(
                `**<:mineria:938500817294590002> Mineria**: Hello **${ctx.author.username}**! It seems that you've never voted me! But don't worry! i'll show you how to vote!\nJust click on [this](https://allegoria.me/vote) and click the "vote" button after the ad. Now join the [Support Server](https://discord.gg/WyDcNCZZHN) and you'll see the confirmation in the **vote** channel!\nYou may also receive a DM from me!`
            )
        }
    }

}

module.exports = new Help;