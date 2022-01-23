'use strict';

const CommandService = require("../services/CommandService");

class InteractionCreate {
    constructor(client) {
        this.client = client;
        this.name = "interactionCreate";
        this.commands = new CommandService(this.client);
    }

    async run(interaction) {
        console.log(`Interaction created`);
        await this.commands.handle(interaction);
    }
}

module.exports = InteractionCreate;