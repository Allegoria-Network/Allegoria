'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-edit',
            category: '<:clan:938506917674889257> Clan',
            description: 'Edits a clan. You must be admin of the clan',
            options: [{
                    type: "STRING",
                    name: "clan_name",
                    description: "The name of the clan you want to create",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "clan_description",
                    description: "The description of the clan you want to create",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "clan_server",
                    description: "The discord server of your clan",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "clan_welcome_message",
                    description: "The message to send to new users of this clan",
                    required: false,
                },
                {
                    type: "BOOLEAN",
                    name: "clan_private",
                    description: "If everyone can join your clan or not",
                    required: false,
                },
                {
                    type: "NUMBER",
                    name: "clan_min_level",
                    description: "The minimum level required to join your clan",
                    required: false,
                },
                {
                    type: "NUMBER",
                    name: "entry_price",
                    description: "The price to pay to join your clan",
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
        if (!clan.admins.includes(`${ctx.author.id}`)) return ctx.errorMessage(`You must be admin of your current clan to edit it`)
        const clanName = ctx.args.getString("clan_name") || clan.clanName
        const clan_description = ctx.args.getString("clan_description") || clan.description
        const clan_server = ctx.args.getString("clan_server") || clan.discord_server
        const clan_welcome_message = ctx.args.getString("clan_welcome_message") || clan.welcome_message
        const isPrivate = ctx.args.getBoolean("clan_private") || clan.private
        const clan_min_level = ctx.args.getNumber("clan_min_leve") || clan.min_level
        const entry_price = ctx.args.getNumber("entry_price") || clan.entry_price
        if (clanName && clan.clan_owner !== ctx.author.id) {
            return ctx.errorMessage(`Only the clan owner can change the name of the clan`)
        }
        clan.clanName = clanName.slice(0, 50)
        clan.description = clan_description ? clan_description.slice(0, 500) : null
        clan.discord_server = clan_server
        clan.welcome_message = clan_welcome_message ? clan_welcome_message.slice(0, 1000) : null
        clan.private = isPrivate
        clan.min_level = clan_min_level
        clan.entry_price = entry_price
        clan.save()
        return ctx.successMessage(`The informations of [${clanName}](https://allegoria.me/clan/${clan.clanID}) has been successfully`)

    }
}

module.exports = new Help;