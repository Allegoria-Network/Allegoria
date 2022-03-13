'use strict';

const { Client, Intents } = require('discord.js');
const CommandsManager = require('./src/utils/CommandsManager.js');
const EventsManager = require('./src/utils/EventsManager.js');
const dashManager = require('./src/utils/dashboardManager')
const DbManager = require('./src/utils/DbManager.js');
const Logger = require('./src/utils/Logger.js');
const { resolve } = require("path");
const mongo = require('./src/utils/MongoDB')
const ApiManager = require('./src/utils/ApiManager.js');
class Bot extends Client {
    constructor() {
        super({
            messageCacheMaxSize: 5,
            messageCacheLifetime: 300,
            intents: [
                Intents.FLAGS.GUILDS,
            ],
            allowedMentions: {
                parse: ["users"]
            },
            restRequestTimeout: 30000
        });
        this.config = require('./config.json');
        this.database = new DbManager(this);
        this.baseApi = new ApiManager(this);
        this.dashboard = new dashManager(this)
        this.logger = new Logger("Shard #" + this.shard.ids);
        this.events = new EventsManager(this);
        this.launch().then(() => {
            this.logger.sucess("All was sucessfuly launched");
            this.user.setActivity("/help | allegoria.me", { type: "PLAYING" });
        }).catch(err => {
            console.log(err)
            this.logger.error(`[LaunchError] An error occured at startup ${err}`);
        })

    }
    async launch() {
        this.baseApi.checkClient(this)
        console.log("[Launching] Bot is launching...");
        await this.events.loadEvent();
        this.logger.sucess(`[Events] Loaded ${this.events.events.size} events`);
        console.log("BAHAHAH")
        try {
            await this.login(this.config.bot.token);
            this.logger.sucess("[WS] Connected to discord");
        } catch (error) {
            this.logger.error(`[WS] Connection error: ${e}`);
        }
        await mongo();
        this.commands = new CommandsManager(this);
        let slash = await resolve(__dirname, "..", "commands")
        await this.commands.loadCommands({ slashed: true, path: slash });
        let prefixCmds = await resolve(__dirname, "..", "prefix_cmds")
        await this.commands.loadCommands({ slashed: false, path: prefixCmds });
        this.logger.sucess(`[Commands] Loaded ${this.commands.commands.size} commands`);
        this.dashboard.launch({ domain: "https://allegoria.me", port: 8080 })
    }
}
process.on('unhandledRejection', (err) => {
    console.log(err)
});
process.on('uncaughtException', (err, origin) => {
    return
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    return
});
process.on('multipleResolves', (type, promise, reason) => {
    return

});

module.exports = new Bot;