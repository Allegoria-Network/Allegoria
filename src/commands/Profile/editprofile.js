'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'profile-edit',
            category: '<:profile:938508980177731604> Profile',
            description: 'Edits your profile',
            options: [{
                    type: "BOOLEAN",
                    name: "private",
                    description: "If you want your profile to be private",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "bio",
                    description: "Your bio. Will be visible to everyone if your profile is public",
                    required: false,
                },
                {
                    type: "BOOLEAN",
                    name: "accepts_battles",
                    description: "If you accepts battles or no",
                    required: false,
                },

            ],
            example: [],
        })
    }

    async run(ctx, userDB) {

        const privateProfile = ctx.args.getBoolean("private") || userDB.private
        const description = ctx.args.getString("bio") || userDB.bio
        const fights_enabled = ctx.args.getBoolean("fights_enabled")
        if (!privateProfile && !description && !fights_enabled) return ctx.errorMessage("Please provide at least one argument")
        if (fights_enabled && !userDB.premium) return ctx.errorMessage(`Uh! Disabling battle is a [Premium](https://allegoria.me/premium) feature! However, you can buy a shield in the shop.`)
        userDB.private = privateProfile;
        userDB.bio = description;
        userDB.fights_enabled = fights_enabled ? fights_enabled : null;
        userDB.save()
        return ctx.successMessage(`Your profile has been successfuly edited`)

    }
}

module.exports = new Help;