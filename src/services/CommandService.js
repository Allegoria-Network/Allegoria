'use strict';

const { Permissions, Message } = require("discord.js");
const Context = require("../utils/Context");
require("../utils/extender.js")
class CommandService {
    constructor(client) {
        this.client = client;
    }

    async handle(interaction) {
            console.log(`[CommandService] Handling interaction ${interaction.id}`);
            if (interaction.isButton()) {
                return interaction.reply({ content: "Action successfully registred.", ephemeral: true })
            }
            if (!interaction.isCommand()) return;
            if (interaction.user.bot || !interaction.inGuild()) return;
            const guild = interaction.guild;
            const me = guild.members.cache.get(this.client.user.id);
            const channelBotPerms = new Permissions(interaction.channel.permissionsFor(me));
            const command = this.client.commands.findCommand(interaction.commandName);
            if (!command) return;
            if (!me.permissions.has("EMBED_LINKS") || !channelBotPerms.has("EMBED_LINKS")) return interaction.errorMessage("The bot must have the `Embed Links` permissions to work properly !");
            const userDB = await this.client.database.getUser(interaction.member.id);
            if (!userDB) {
                interaction.reply({
                    embeds: [{
                        color: "#efaa66",
                        author: { name: "Please accept the rules to proceed", icon_url: interaction.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                        description: "Hello! you need to accept my [rules](https://allegoria-bot.app/rules) and create a profile to interact with me!\nClick on the button to proceed",
                    }],
                    components: [{
                        components: [{ customId: "proceed_button", emoji: "<:check:847244236277678080>", label: "Accept & Proceed", style: 3, type: "BUTTON" }],
                        type: 'ACTION_ROW'
                    }, ]
                })
                const message_send = await interaction.fetchReply().catch(console.error);
                const filter = (interactione) => interactione.customId === 'proceed_button' && interactione.user.id === interaction.user.id && interactione.user.id !== this.client.user.id;;
                const collector = message_send.createMessageComponentCollector({ filter, time: 195000, max: 1 });
                collector.on('collect', inter => {
                    message_send.edit({
                        embeds: [{
                            color: "#efaa66",
                            author: { name: "Some links", icon_url: interaction.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                            description: "• [Website](https://allegoria-bot.app)\n• [Discord Server](https://discord.gg/6wa4U5sAMe)\n• [Vote](https://allegoria-bot.app/vote)",
                        }],
                        content: `You have accepted our rules successfuly and created your account!\nHello! **${interaction.user.username}** I am **<:mineria:929416897311694858> Mineria** and I will help you during your adventure! You're now able to interaction with thousands of people!\n\n__Guide__\n• You can use \`/setup-profile\` to customize your profile.\n• Check our [Starter guide](https://guide.allegoria.me) to learn how to use the bot\n• Feel free to come on our official support server to get more help! https://discord.gg/6wa4U5sAMe `,
                        components: [{
                            components: [{ customId: "proceed_button", emoji: "<:check:847244236277678080>", label: "Accept & Proceed", disabled: true, style: 3, type: "BUTTON" }],
                            type: 'ACTION_ROW'
                        }, ]
                    })
                    this.client.database.insertUser(interaction.member);
                    collector.stop()
                    return
                });
                collector.on('end', reason => {
                    if (reason !== "time") return
                    message_send.edit({
                        embeds: [{
                            color: "#efaa66",
                            author: { name: "Times up!", icon_url: interaction.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/6wa4U5sAMe" },
                            description: "Please do the command again",
                        }],
                        components: [{
                            components: [{ customId: "proceed_button", emoji: "<:check:847244236277678080>", label: "Accept & Proceed", disabled: true, style: 3, type: "BUTTON" }],
                            type: 'ACTION_ROW'
                        }, ]
                    })
                });
                return
            }
            if (command.ownerOnly && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
                if (!command.hidden) return interaction.errorMessage(`You can't use this command, it's for my creator.`);
            }
            if (command.userPerms.length > 0 && !command.userPerms.some(p => guild.members.cache.get(interaction.user.id).permissions.has(p))) {
                return interaction.errorMessage(`You must have \`${command.userPerms.join("`, `")}\` permissions to execute this command.`);
            }
            if (command.botPerms.length > 0 && !command.botPerms.every(p => me.hasPermission(p) && channelBotPerms.has(p))) {
                return interaction.errorMessage(`The bot must have \`${command.botPerms.join("`, `")}\` permissions to execute this command.`);
            }
            if(command.checks){
               if(command.checks.setupProfile && !userDB.done)   return interaction.errorMessage(`Calm down! You have to complete your profile before using that command!\n Use the \`/setup-profile\` command to complete your profile`)
            }
        const ctx = new Context(this.client, interaction);
        try {
            await command.run(ctx,userDB);
            this.client.logger.info(`Command ${command.name} executed by ${ctx.member.user.username} in ${ctx.guild.name}`);
        } catch (error) {
            this.client.logger.error(error);
            const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
         interaction.errorMessage(`Sorry, an unexpected error was occured (\`${randomString}\`).\n Please join our [Support Server](https://discord.gg/synAXZtQHM) and report this issue.`)
         ctx.client.database.registerError(randomString,error);
        }
    }
}

module.exports = CommandService;