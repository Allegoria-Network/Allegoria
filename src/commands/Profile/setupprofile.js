'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'setup-profile',
            category: '<:profile:929660871477706752> Profile',
            description: 'Displays/Edit/delete your profile or the profile of another user',
            options: [],
            example: [],
        })
    }

    async run(ctx, userDB) {
            if (userDB.done) return ctx.errorMessage("Uh no! You have already setup your account. But nice try :)")
            ctx.reply({
                components: [{
                    components: [{ customId: "private", emoji: "<:check:847244236277678080>", label: "Yes", style: 3, type: "BUTTON" },
                        { customId: "public", emoji: "<:reject:929356899336486942>", label: "No", style: 4, type: "BUTTON" }
                    ],
                    type: 'ACTION_ROW'
                }, ],
                content: `Hello **${ctx.author.username}**, it's me back, **Mineria <:mineria:929416897311694858>**. Now we're going to complete your account by setting some important things! Note that you can do it only once during your adventure! so choose accurately!\n\nFirst of all, do you want to keep your profile private? (If yes, you will not be ranked)`
            })
            let message_send = await ctx.interaction.fetchReply().catch(console.error);
            const filter = (ctxe) => ctxe.user.id === ctx.author.id && ctxe.user.id !== ctx.client.user.id;
            const collector = message_send.createMessageComponentCollector({ filter, time: 195000, max: 1 });
            collector.on('collect', async inter => {
                        console.log("Collect")
                        if (inter.customId === "public") {
                            userDB.private = false
                        } else {
                            userDB.private = true
                        }
                        userDB.save()
                        collector.stop()
                        message_send.edit({
                                    components: [{
                                        components: [
                                            { customId: "warrior", emoji: "<:warrior:929356045476835368>", label: "Warrior", style: 2, type: "BUTTON" },
                                            { customId: "bow", emoji: "<:bow:929355948026388531>", label: "Bow", style: 2, type: "BUTTON" },
                                            { customId: "wizard", emoji: "<:wizard:929356100199919656>", label: "Wizard", style: 2, type: "BUTTON" },
                                            { customId: "alchemist", emoji: "<:alchemist:929421004361592902>", label: "Alchemist", style: 2, type: "BUTTON" },
                                            { customId: "ninja", emoji: "<:ninja:929421041078509609>", label: "Ninja", style: 2, type: "BUTTON" }
                                        ],
                                        type: 'ACTION_ROW'
                                    }],
                                    content: `${userDB.private? `Awesome! I love to be hidden from other people too!`:"Nice, that's what I choosed too years ago!"} But now let's choose a character for your adventure. Here's the list:\n\n• <:swordman:929356045476835368> Warrior (+15% defense, +15% damage, -15% daily)\n• <:bow:929355948026388531> Bow (+5% mana, +35% loot in forest )\n• <:wizard:929356100199919656> Wizard (+40% mana, -20% defense)\n• <:alchemist:929421004361592902> Alchemist (+20% mana, +5% daily) \n• <:ninja:929421041078509609>  Ninja (+10% daily, +10% damage)\n\nPlease react to the button corresponding to the character you want to use. Note that you won't be able to change!`

    })  
   let message_send_2 = await ctx.interaction.fetchReply().catch(console.error);
    const filter = (ctxe) => ctxe.user.id === ctx.author.id&& ctxe.user.id !== ctx.client.user.id;;
    const collector_2 = message_send_2.createMessageComponentCollector({ filter, time: 195000, max: 1 });
    collector_2.on('collect', inter => {
        message_send_2.edit({
            embeds: [{
                color: "#efaa66",
                author: { name: "Your profile", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                description: `Private: ${userDB.private?`<:check:847244236277678080>`: `<:reject:929356899336486942>`}\nCharacter: ${inter.customId}\n Coins: 50 <:gold_bag:929356637154717697>`,
            }],
            content:`**Mineria <:mineria:929416897311694858>**: Your account has been successfully finished! Nice work **${ctx.author.username}**! I'm sure you will be a very talented **${inter.customId}**!\nI have just made you a gift of **50** <:gold_bag:929356637154717697>! You will learn in the future how to use them!\n\n You are now able to reddem you daily pay! Why not starting with that? Just do \`/daily\``,
            components: [{
                components: [{ customId: "proceed_button", emoji: "<:check:847244236277678080>", label: "Good work!", disabled: true, style: 2, type: "BUTTON" }],
                type: 'ACTION_ROW'
            }, ]
        })
        userDB.done =true
        userDB.coins = userDB.coins+50
        userDB.character = inter.customId
        userDB.save()
        collector_2.stop()
        return
    });
    collector_2.on('end', reason => {
        if (reason !== "time") return
        message_send_2.edit({
            embeds: [{
                color: "#efaa66",
                author: { name: "Times up!", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                description: "Please do the command again",
            }],
            components: [{
                components: [{ customId: "proceed_button", emoji: "<:check:847244236277678080>", label: "Accept & Proceed", disabled: true, style: 3, type: "BUTTON" }],
                type: 'ACTION_ROW'
            }, ]
        })
    });
    return
                });
                collector.on('end', reason => {
                    if (reason !== "time") return
                    message_send.edit({
                        embeds: [{
                            color: "#efaa66",
                            author: { name: "Times up!", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                            description: "Please do the command again",
                        }],
                        components: [{
                            components: [{ customId: "proceed_button", emoji: "<:check:847244236277678080>", label: "Yes", disabled: true, style: 3, type: "BUTTON" }],
                            type: 'ACTION_ROW'
                        }, ],
                    })
                });
                return
            }
        


}

module.exports = new Help;