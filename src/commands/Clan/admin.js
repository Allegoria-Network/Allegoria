'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-admin',
            category: '<:clan:938506917674889257> Clan',
            description: 'Adds/remove an admin from the clan',
            options: [{
                    type: "USER",
                    name: "add",
                    description: "The user you want to do admin",
                    required: false,
                },
                {
                    type: "USER",
                    name: "remove",
                    description: "The user to remove admin perms",
                    required: false,
                },

            ],
            example: [],
        })
    }

    async run(ctx, userDB) {
        if (!userDB.done) return ctx.errorMessage("Calm down! You have to complete the configuration of your account! Do `/setup-profile`")
        if (!userDB.clan) return ctx.errorMessage("You are not in a clan yet! You have to be in a clan to use this command")
        const clan = await ctx.database.getClan(userDB.clan)
        if (clan.clan_owner !== ctx.author.id) return ctx.errorMessage(`You must be the owner of your clan to do that!`)
        const remove = ctx.args.getUser("remove")
        const add = ctx.args.getUser("add")
        if (!remove && !add) return ctx.errorMessage("Please provide a member to add or to remove")
        if (remove) {
            if (!clan.members.includes(`${remove.id}`)) return ctx.errorMessage(`**${remove.username}** is not a member of **${clan.clanName}** so you can't remove him as admin.`)
            if (!clan.admins.includes(`${remove.id}`)) return ctx.errorMessage(`**${remove.username}** is not already admin of of [${clan.clanName}](https://allegoria.me/clan/${clan.clanID})`)
            const index = clan.admins.indexOf(remove.id);
            if (index > -1) {
                clan.admins.splice(index, 1);
            }
            clan.save()
            ctx.successMessage(`**${remove.username}** is no longer an admin of [${clan.clanName}](https://allegoria.me/clan/${clan.clanID})`)
        } else {
            if (!clan.members.includes(`${add.id}`)) return ctx.errorMessage(`**${add.username}** is not a member of **${clan.clanName}** so you can't add him as admin.`)
            if (clan.admins.includes(`${add.id}`)) return ctx.errorMessage(`**${add.username}** is already admin of of [${clan.clanName}](https://allegoria.me/clan/${clan.clanID})`)
            clan.admins.push(`${add.id}`)
            clan.save()
            ctx.successMessage(`**${add.username}** is no longer an admin of [${clan.clanName}](https://allegoria.me/clan/${clan.clanID})`)
        }
        return ctx.successMessage(`The informations of [${clanName}](https://allegoria.me/clan/${clan.clanID}) has been successfully`)

    }
}

module.exports = new Help;