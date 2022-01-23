'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'quests',
            category: '<:profile:929660871477706752> Profile',
            description: 'Displays your active quests',
            options: [],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
        ctx.successMessage("No quest available")
    }

}

module.exports = new Help;