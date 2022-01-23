'use strict';

const Command = require('../../utils/Command.js');
const moment = require("moment")

class Help extends Command {
    constructor() {
        super({
            name: 'cooldowns',
            category: '<:profile:929660871477706752> Profile',
            description: 'Displays your cooldowns',
            options: [],
            example: [],
            checks: { setupProfile: true }

        })
    }

    async run(ctx, userDB) {
        const a = userDB.cooldowns.daily ? userDB.cooldowns.daily : 0
        const d_1 = moment(a);
        const d_2 = moment(a + (1000 * 60 * 60 * 12));

        const b = userDB.cooldowns.miney ? userDB.cooldowns.mine : 0
        const b_1 = moment(b);
        const b_2 = moment(b + (1000 * 60 * 30));

        ctx.reply({
            embeds: [{

                fields: category.map(x => {
                    return {
                        name: x,
                        value: ctx.client.commands.commands.filter(cmd => cmd.category === x && !cmd.cmdTest).filter(cmd => cmd.category === x && !cmd.ownerOnly).map(cmd => `\`${cmd.name}\``).join(", ")
                    };
                }),
                color: "#efaa66",
                author: { name: "Your cooldowns", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                footer: { text: `Tip: Go premium to increase your cooldowns`, icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }) },
                description: `__Daily__: \nLast redeem: <t:${d_1.unix()}:R>\nNext redeem: <t:${d_2.unix()}:R>\n__Mine__: \nLast redeem: <t:${b_1.unix()}:R>\nNext redeem: <t:${b_2.unix()}:R>`,
            }]
        })
    }

}

module.exports = new Help;