'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-join',
            category: '<:clan:938506917674889257> Clan',
            description: 'Joins a clan. You can provide the name of the id of a clan',
            options: [{
                    type: "STRING",
                    name: "clan_name",
                    description: "The name/id of the clan you want to join",
                    required: true,
                },

            ],
            example: [],
        })
    }

    async run(ctx, userDB) {
        if (!userDB.done) return ctx.errorMessage("Calm down! You have to complete the configuration of your account! Do `/setup-profile`")
        if (userDB.clan) return ctx.errorMessage("You are already member of a clan. Please leave this one before joining a clan.")
        if (2 > userDB.level) return ctx.errorMessage("Uh no! You must be at least level **2** to join a clan!\nWant to gain levels more quickly? Check our [Premium](https://allegoria.me/premium)") // j'ai écris dans le readme que si un joueur quitte un clan, il doit attendre 1 semaine pour en rejoindre un nouveau UH
        if (userDB.hasBeenInAClan && userDB.hasBeenInAClan.date) {
            if (Date.now() >= userDB.hasBeenInAClan.date + (1000 * 60 * 60 * 24 * 7)) {} else {
                const d = moment(userDB.hasBeenInAClan.date + (1000 * 60 * 60 * 24 * 7));
                const discordDate = `<t:${d.unix()}:R>`;
                return ctx.errorMessage("Hangs up! You have left a clan in the last week.\n You have to wait " + discordDate + "  before joining another clan")
            }
        }
        const clanName = ctx.args.getString("clan_name").slice(0, 50)
        const clan = await ctx.database.getClan(clanName)
        if (!clan) return ctx.errorMessage("Sorry but this clan doesn't exists")
        if (clan.members && clan.members.includes(`${ctx.author.id}`)) return ctx.errorMessage(`You are already member of this clan :)`)
        if (clan.members_banned && clan.members_banned.includes(`${ctx.author.id}`)) return ctx.errorMessage(`Uh oh! It seems that you did something bad because you're banned from **${clan.clanName}**`)
        if (clan.private) return ctx.errorMessage("Sorry but **" + clan.clanName + "** is a private clan. Please ask the owner to invite you to join this clan")
        if (clan.min_level && clan.min_level > userDB.level) return ctx.errorMessage("Sorry but you have to be at least level **" + clan.min_level + "** to join  **" + clan.clanName + "**\nWant to gain levels more quickly? Check our [Premium](https://allegoria.me/premium)")
        if (clan.entry_price && clan.entry_price > userDB.coins) return ctx.errorMessage("Sorry but you need to have at least **" + clan.entry_price + " <:coins:935949762690179133>** to join **" + clan.clanName + "**.\nWant to gain money more quickly? Check our [Premium](https://allegoria.me/premium)")
        clan.members.push(`${ctx.author.id}`)
        clan.save()
        userDB.clan = clan.clanID;
        if (!userDB.hasBeenInAClan) {
            userDB.hasBeenInAClan = { date: Date.now() }
            ctx.database.markQuestCompleted(userDB, "Join your first clan.", false, ctx, 200)
            userDB.coins = userDB.coins + 200;
            userDB.completed_quests.push({ name: "Join your first clan.", date: Date.now() })
            ctx.reply(`**<:mineria:938500817294590002> Mineria**: Nice **${ctx.author.username}** you have joined your first clan successfuly! Congrats!\n\nWhat can you do in a clan? When you join a clan, you can give resources to it and withdraw gold or wood with higher member's permission. Then, if they accept, you can get resources to buy items. You can also participate on a war <:swords:929356456275361792>`)
        } else {
            ctx.reply(`**<:mineria:938500817294590002> Mineria**: Nice **${ctx.author.username}** you are now member of **${clan.clanName}** ( Now ${clan.members.length} members!)! \n<:clan:938506917674889257> Your role: Member `)
            userDB.hasBeenInAClan = { date: Date.now() }
        }
        if (clan.welcome_message) {
            setTimeout(() => {
                ctx.send({ content: clan.welcome_message })
            }, 1000)
        }
        userDB.save()
    }

}

module.exports = new Help;