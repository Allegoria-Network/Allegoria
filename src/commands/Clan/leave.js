'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'clan-leave',
            category: '<:clan:929660809880141874> Clan',
            description: 'Leaves your current clan. Note that you won\'t be able to join a clan for 7 days',
            options: [],
            example: [],
        })
    }

    async run(ctx, userDB) {
        if (!userDB.done) return ctx.errorMessage("Calm down! You have to complete the configuration of your account! Do `/setup-profile`")
        if (!userDB.clan) return ctx.errorMessage("You are not member of a clan so you can't use this command.")
        const clan = await ctx.database.getClan(userDB.clan)
        if (clan.clan_owner === ctx.author.id) return ctx.errorMessage(`You can't leave your clan because you are the owner of this one.`)
        const d = moment(Date.now() + (1000 * 60 * 60 * 24 * 7));
        const discordDate = `<t:${d.unix()}:R>`;
        ctx.reply({
            content: `**<:mineria:929416897311694858> Mineria**: You're going to leave **${clan.clanName}**. Note that all the coins, ressources etc you transfered to the clan will belong to the clan forever.\n\n<:infos:929660747859001344> You won't be abble to join another clan for a week. so you will be able to join another clan only in ${discordDate}.\nClick on the green button to confirm and the red button to abort..`,
            components: [{
                components: [{ customId: "confirm", emoji: "<:check:847244236277678080>", label: "Confirm", style: 3, type: "BUTTON" },
                    { customId: "cancel", emoji: "<:reject:929356899336486942>", label: "Cancel", style: 4, type: "BUTTON" }
                ],
                type: 'ACTION_ROW'
            }, ]
        })
        const message_send = await ctx.interaction.fetchReply().catch(console.error);
        const filter = (ctxe) => ctxe.user.id === ctx.author.id && ctxe.user.id !== ctx.client.user.id;;
        const collector = message_send.createMessageComponentCollector({ filter, time: 195000, max: 1 });
        collector.on('collect', inter => {
            if (inter.customId === "confirm") {
                message_send.edit({
                    content: `**<:mineria:929416897311694858> Mineria**: Well, all is done! You're no longer a member of **${clan.clanName}**`,
                    components: [{
                        components: [{ customId: "confirm", emoji: "<:check:847244236277678080>", label: "Confirm", disabled: true, style: 3, type: "BUTTON" },
                            { customId: "cancel", emoji: "<:reject:929356899336486942>", label: "Cancel", disabled: true, style: 4, type: "BUTTON" }
                        ],
                        type: 'ACTION_ROW'
                    }, ]
                })
                const index = clan.members.indexOf(ctx.author.id);
                if (index > -1) {
                    clan.members.splice(index, 1);
                }
                console.log(clan.members)
                clan.save()
                userDB.clan = null;
                userDB.save()
            } else {
                message_send.edit({
                    content: `**<:mineria:929416897311694858> Mineria**: The operation has been cancelled successfully. You are still a member of **${clan.clanName}**`,
                    components: [{
                        components: [{ customId: "confirm", emoji: "<:check:847244236277678080>", label: "Confirm", disabled: true, style: 3, type: "BUTTON" },
                            { customId: "cancel", emoji: "<:reject:929356899336486942>", label: "Cancel", disabled: true, style: 4, type: "BUTTON" }
                        ],
                        type: 'ACTION_ROW'
                    }, ]
                })
            }

            collector.stop()
            return
        });
        collector.on('end', reason => {
            if (reason !== "time") return
            message_send.edit({
                content: `**<:mineria:929416897311694858> Mineria**: The operation has been cancelled successfully. You are still a member of **${clan.clanName}**`,
                components: [{
                    components: [{ customId: "confirm", emoji: "<:check:847244236277678080>", label: "Confirm", disabled: true, style: 3, type: "BUTTON" },
                        { customId: "cancel", emoji: "<:reject:929356899336486942>", label: "Cancel", disabled: true, style: 4, type: "BUTTON" }
                    ],
                    type: 'ACTION_ROW'
                }, ]
            })
        });
        return
    }

}

module.exports = new Help;