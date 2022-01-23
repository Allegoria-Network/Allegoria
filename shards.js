'use strict';

const { ShardingManager } = require("discord.js");
const { bot } = require("./config.json");
const Logger = require('./src/utils/Logger.js');
const shardManagerLogger = new Logger("ShardingManager");
shardManagerLogger.info("Sharding manager starting !");
const process_args = process.argv.slice(2);

new ShardingManager("./main.js", {
    respawn: true,
    totalShards: process_args && parseInt(process_args[1]) && process_args[0] === "--shard" ? parseInt(process_args[1]) : "auto",
    token: bot.token
}).on("shardCreate", (shard) => {
    shardManagerLogger.info(`Creating Shard #${shard.id}`);
}).spawn().then(() => {
    shardManagerLogger.sucess("All shards are launched !");
}).catch(err => {
    return shardManagerLogger.error("An error has occurred ! " + err);
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