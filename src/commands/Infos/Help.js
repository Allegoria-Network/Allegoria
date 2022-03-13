'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            category: '<:info:948273758156783646> Infos',
            description: 'Display all the commands of the bot',
            options: [{
                type: "STRING",
                name: "command",
                description: "Get the help of this command",
                required: false,
            }],
            example: ['help', 'help botinfo'],
        })
    }

    async run(ctx) {

        if (ctx.args.getString("command")) {
            const command = ctx.client.commands.findCommand(ctx.args.getString("command").toLowerCase());
            if (!command) return ctx.errorMessage(`The command \`${ctx.args.getString("command")}\` doesn't exist.`);
            return ctx.reply({
                embeds: [{
                    title: "Help",
                    color: "#efaa66",
                    description: command.description,
                    fields: [{
                            name: "Usage",
                            value: command.options ? command.options.map((x) => `\`${x.required ? "(" : "<"}${x.name}:${x.type.toLowerCase()}${x.required ? ")" : ">"}\``).join("\n") : "No usage" || "No usage",
                            inline: true
                        },
                        {
                            name: "Examples",
                            value: command.example ? command.example.map((x) => "`" + x + "`").join("\n") : "No examples",
                            inline: true
                        }, {
                            name: "Aliases",
                            value: command.aliases ? command.aliases.map((x) => "`" + x + "`").join("\n") : "No aliases",
                            inline: true
                        }
                    ]
                }]
            });
        }

        const category = [];

        ctx.client.commands.commands.each((command) => {
            if (!category.includes(command.category) && !command.disabled) {
                category.push(command.category);
            }
        });

        ctx.reply({
            embeds: [{

                fields: category.map(x => {
                    return {
                        name: x,
                        value: ctx.client.commands.commands.filter(cmd => cmd.category === x && !cmd.cmdTest).filter(cmd => cmd.category === x && !cmd.ownerOnly).map(cmd => `\`${cmd.name}\``).join(", ")
                    };
                }),
                color: "#efaa66",
                author: { name: "Help Command", icon_url: ctx.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/r8fVHdh5TD" },
                footer: { text: `Do /help <command> for more informations about a command!`, icon_url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" }) },
                description: "• Hello! I only support Slash commands so press / to use one of my commands!\n • Need help with the bot? Come on on our [Guild](https://discord.gg/r8fVHdh5TD)\n• Purchasing a [Premium membership](https://allegoria.me/premium) is a great way to get a boost ahead!",
            }]
        })

    }

}

module.exports = new Help;