'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'create-clan',
            category: '<:clan:938506917674889257> Clan',
            description: 'Creates a clan. You must be level 5',
            options: [{
                    type: "STRING",
                    name: "clan_name",
                    description: "The name of the clan you want to create",
                    required: true,
                },
                {
                    type: "BOOLEAN",
                    name: "clan_private",
                    description: "If everyone can join your clan or not",
                    required: true,
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
        if (userDB.clan) return ctx.errorMessage("You are already member of a clan. Please leave this one before creating a clan.")
        if (5 > userDB.level) return ctx.errorMessage("Uh no! You must be at least level **5** to create a clan!\nWant to gain levels more quickly? Check our [Premium](https://allegoria.me/premium)")
        if (userDB.hasBeenInAClan && userDB.hasBeenInAClan.date) {
            if (Date.now() >= userDB.hasBeenInAClan.date + (1000 * 60 * 60 * 24 * 7)) {} else {
                const d = moment(userDB.hasBeenInAClan.date + (1000 * 60 * 60 * 24 * 7));
                const discordDate = `<t:${d.unix()}:R>`;
                return ctx.errorMessage("Hangs up! You have left a clan in the last week.\n You have to wait " + discordDate + "  before joining another clan")
            }
        }
        const clanName = ctx.args.getString("clan_name").slice(0, 50)
        const isPrivate = ctx.args.getBoolean("clan_private")
        const clan_min_level = ctx.args.getNumber("clan_min_leve")
        const entry_price = ctx.args.getNumber("entry_price")
        const clanId = ctx.database.uniqID(4)
        const clanData = {
            clanID: clanId,
            clanName: clanName,
            creation_date: Date.now(),
            private: isPrivate,
            verified_clan: false,
            coins: 0,
            ressources: {
                wood: 0
            },
            clan_owner: ctx.author.id,
            admins: [],
            members: [],
            entry_price: entry_price ? entry_price : 0,
            min_level: clan_min_level ? clan_min_level : 0,
        }
        clanData.admins.push(`${ctx.author.id}`)
        clanData.members.push(`${ctx.author.id}`)
        ctx.database.insertClan(clanData)
        userDB.clan = clanId;
        if (!userDB.hasBeenInAClan) {
            userDB.hasBeenInAClan = { date: Date.now() }
            ctx.reply(`**<:mineria:938500817294590002> Mineria**: Nice **${ctx.author}** you have created your first clan successfuly! Congrats!\n\nWhat can you do in a clan? When you join a clan, you can give resources to it and withdraw gold or wood with higher member's permission. Then, if they accept, you can get resources to buy items. You can also participate on a war <:swords:929356456275361792>\n\n<:clan:938506917674889257> Invite link of your clan: https://allegoria.me/c/${clanId}`)
        } else {
            ctx.reply(`**<:mineria:938500817294590002> Mineria**: Nice **${ctx.author}** your clan **${clanName}** has been successfully created! \n<:clan:938506917674889257> Clan Id: ${clanId} \n\nTell to your friends to do \`/clan-join ${clanId}\` to join your clan or share this link: https://allegoria.me/c/${clanId}`)
            userDB.hasBeenInAClan = { date: Date.now() }
        }
        userDB.save()
    }

}

module.exports = new Help;