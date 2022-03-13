'use strict';

const Command = require('../../utils/Command.js');
const data = require("../../databases/items.json")

const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'battle',
            category: '<:profile:938508980177731604> Profile',
            description: 'Fights yourself with another users',
            options: [{
                    type: "USER",
                    name: "user",
                    description: "The user who you want to fight",
                    required: false,
                },

            ],
            example: [],
        })
    }

    async run(ctx, userDB) {
        if (!userDB.done) return ctx.errorMessage("Calm down! You have to complete the configuration of your account! Do `/setup-profile`")
        if (2 > userDB.level) return ctx.errorMessage("Uh no! You must be at least level **2** to fight yourself!\nWant to gain levels more quickly? Check our [Premium](https://allegoria.me/premium)")
        if (ctx.database.checkWaiting(ctx.author.id)) return ctx.errorMessage("You are already waiting for a battle.")
        ctx.reply(
            `**<:mineria:938500817294590002> Mineria**: Hello **${ctx.author.username}**! I'll search a good opponent for you! \n\n*This operation can took up to 5m so please be patient!*`
        )
        ctx.database.AddWaitingList(ctx.author.id)
        const message_send = await ctx.interaction.fetchReply().catch(console.error);
        let tryAttempts = 0;
        let found = null;
        let cancelled = null;
        var refreshIntervalId = setInterval(async() => {
            if (found || cancelled) return
            let adv = await ctx.database.findAdversary(ctx.author.id)
            if (!adv) {
                tryAttempts++
                if (tryAttempts >= 10) {
                    cancelled = true
                    return message_send.edit(`**<:mineria:938500817294590002> Mineria**: Sorry, I dind't found anybody for you...\n\nTry again later!`)
                }
            }
            if (adv) {
                message_send.edit(`**<:mineria:938500817294590002> Mineria**: I've found <@${adv}> to fight with you! Starting the battle NOW!`)
                const advDb = await ctx.database.getUser(adv)
                if(!advDb) return ctx.errorMessage("Uh oh! Something went wrong while doing your battle! try again later")
                let _user_1 ={items:[],damage:0,defence:0}
                let _user_2 = {}
                advDb.items.forEach(item => {
                    const fetchedItem = data.items.find(item=>item.id === item)
                    const valid = ["Swords","Shield"]
                    if(!fetchedItem || !valid.includes(fetchedItem)) return;
                    _user_1.damage += fetchedItem?.damage
                    _user_1.defence +=fetchedItem?.protection
                });
                const user1 = (user1.level/2)
                message_send.edit(`**<:mineria:938500817294590002> Mineria**: I've found <@${adv}> to fight with you! Starting the battle NOW!\n\nHis damage: ${_user_1.damage} \nDefence: ${_user_1.defence}`)

                ctx.database.RemoveWaitingList(ctx.author.id)
                found = true
            }
        }, 15000)
        if (found || cancelled) {
            clearInterval(refreshIntervalId);
        }

    }

}

module.exports = new Help;