'use strict';

/*
Ca va paraitre énervent au début mais c'est super utile ! Au lieu de faire à chaque fois dans vos commandes 
Au lieu de message, ou client ca sera -> ctx.message ou ctx.client
Avantages: 
Au lieu de faire message.guild.members.cache.get(message.author.id); dans vos commandes
ctx.member; utile non ? 
remplacer aussi ctx.message.channel.send() par ctx.send(); !
*/
class Context {
    constructor(client, interaction) {
        this.interaction = interaction;
        this.client = client;
        this.args = interaction.options;
        this.lang = client.config.mainLang;
    }

    get shards() {
        if (!this.shard) throw new Error('Shard non trouvable')
        return this.shard
    }

    get guild() {
        return this.interaction.guild;
    }
    get database() {
        return this.client.database;
    }
    get channel() {
        return this.interaction.channel;
    }

    get author() {
        return this.interaction.user;
    }

    get member() {
        return this.interaction.member;
    }

    get me() {
        return (this.guild ? this.guild.members.cache.get(this.client.user.id) : undefined);
    }
    send(...content) {
        return this.interaction.channel.send(...content); // for embed or file or simple message
    }
    reply(...content) {
        return this.interaction.reply(...content); // for embed or file or simple message
    }
    substractChar(userDB, pay) {
        let finalAmout;
        let sign;
        switch (userDB.character) {
            case 'ninja':
                sign = "added"
                finalAmout = 115 / 100 * pay
                break;
            case 'alchemist':
                sign = "added"
                finalAmout = 105 / 100 * pay
                break;
            case 'bow':
                sign = "added"
                finalAmout = pay
                break;
            case 'warrior':
                sign = "removed"
                finalAmout = 85 / 100 * pay
                break;
            case 'wizard':
                sign = "added"
                finalAmout = pay
                break;
            default:
                console.log(`Sorry, we are out of ${expr}.`);
        }
        console.log(`Final ${Math.floor(finalAmout)},pay: ${pay}`)
        if (userDB.bonuses && userDB.bonuses.daily) {
            this.client.logger.info(`Bonus of ${userDB.bonuses.daily}`)
            const percentage = parseInt(100 + parseInt(userDB.bonuses.daily))
            this.client.logger.info(`Percentage of ${percentage}`)
            console.log(`${finalAmout * percentage}`)
            finalAmout = Number(parseInt(finalAmout * percentage))
        }
        console.log(`Final ${Math.floor(finalAmout)},pay: ${pay}`)
        return { number: Math.floor(finalAmout), sign: sign }

    }
    errorMessage(msg) {
        return this.interaction.reply({
            embeds: [{
                description: "<:error:938500833258143774> " + msg,
                color: "#C73829",
            }]
        })
    }
    errorMessageChannel(msg) {
        return this.interaction.channel.send({
            embeds: [{
                description: msg,
                color: "#C73829",
                author: { name: this.interaction.guild.name, icon_url: this.interaction.guild.icon ? this.interaction.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128", url: "https://discord.com/oauth2/authorize?client_id=901466922820988968&scope=bot&permissions=19456" },
            }]
        })
    }
    successMessage(msg) {
        return this.interaction.reply({
            embeds: [{
                description: "<:success:938500833421697074> " + msg,
                color: "#2ED457",
            }]
        })
    }
    defer(...args) {
        this.interaction.defer(...args);
    }

    /*sendRichMessage (content,data) {
        return this.channel.send(content,data); // for simple message plus embed plus/or file
    }*/
}

module.exports = Context;