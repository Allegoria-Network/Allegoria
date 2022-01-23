const { Interaction } = require("discord.js");
Interaction.prototype.errorMessage = function(msg = {}) {
    return this.reply({
        embeds: [{
            description: "<:reject:929356899336486942> " + msg,
            color: "#C73829",
        }]
    })
};