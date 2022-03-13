const { Interaction } = require("discord.js");
Interaction.prototype.errorMessage = function(msg = {}) {
    return this.reply({
        embeds: [{
            description: "<:error:938500833258143774> " + msg,
            color: "#C73829",
        }]
    })
};