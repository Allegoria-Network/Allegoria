'use strict';

const Command = require('../../utils/Command.js');
const quests = require("../../databases/quests.json")

class Help extends Command {
    constructor() {
        super({
            name: 'quests',
            category: '<:profile:938508980177731604> Profile',
            description: 'Displays your active quests',
            options: [],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
            ctx.reply({
                        embeds: [{
                                    color: "#efaa66",
                                    author: { name: "Your quests", icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },

                                    fields: quests.map(x => {
                                                return {
                                                    name: `• ${x.name} (${userDB.completed_quests.find(q=>q.name ===x.name)?`<:success:938500833421697074> `:"<:error:938500833258143774>"})`,

                        inline: true,
                        value: `Requirements: ${x.requiredGold?`\n• ${x.requiredGold.toLocaleString()} <:coins:935949762690179133> `:""}${x.requiredWood?`\n• ${x.requiredWood.toLocaleString()} <:wood:938500833316847738> `:""}${x.dailyCount?`\n• ${x.dailyCount} daily redeems <:writing:948271792747855873> `:""}${x.mineCount?`\n• ${x.mineCount} mine redeems <:writing:948271792747855873> `:""}\nRewards: **${x.rewardCoins} <:coins:935949762690179133>**`
                    };
                }),

            }]
        })
    }

}

module.exports = new Help;