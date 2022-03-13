'use strict';

const { ShardingManager } = require("discord.js");
const { bot } = require("./config.json");
const shardManagerLogger = new Logger("ShardingManager");
shardManagerLogger.info("Sharding manager starting !");

new ShardingManager("./main.js", {
    respawn: true,
    token: bot.token
}).spawn().then(() => {
    console.sucess("All shards are launched !");
}).catch(err => {
    return console.error("An error has occurred ! " + err);
});
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
