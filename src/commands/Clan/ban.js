'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-ban',
            category: '<:clan:929660809880141874> Clan',
            description: 'Bans a member from a clan',
            options: [{
                    type: "USER",
                    name: "user",
                    description: "The user to ban from the clan",
                    required: true,
                },

            ],
            example: [],
        })
    }

    async run(ctx, userDB) {
        if (!userDB.done) return ctx.errorMessage("Calm down! You have to complete the configuration of your account! Do `/setup-profile`")
        if (!userDB.clan) return ctx.errorMessage("You must be administrator of a clan to ban someone.")
        const user = ctx.args.getUser("user")
        const clan = await ctx.database.getClan(userDB.clan)
        const userinDB = await ctx.database.getUser(user.id)
        if (!clan.admins.includes(`${ctx.author.id}`)) return ctx.errorMessage(`You must be admin of your current clan to ban someone`)
        if (!clan.members.includes(`${user.id}`)) return ctx.errorMessage(`**${user.username}** is not a member of **${clan.clanName}** so you can't ban him.`)
        const index = clan.members.indexOf(user.id);
        if (index > -1) {
            clan.members.splice(index, 1);
        }
        console.log(clan.members)
        clan.members_banned.push(`${user.id}`)
        clan.save()
        userinDB.clan = null;
        userinDB.save()
        ctx.successMessage(`${user} is no longer a member of [${clan.clanName}](https://allego.me/clan/${clan.clanID}) and can't join this clan anymore.`)


    }

}

module.exports = new Help;