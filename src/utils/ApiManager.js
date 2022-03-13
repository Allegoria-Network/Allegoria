'use strict';
const fetch = require('node-fetch');
const config = require('../../config.json')

class ApiManager {
    constructor(client) {
        this.client = client;
        this.baseUrl = "https://api.green-bot.app/v2"
        this.discordApiUrl = "https://discordapp.com/api";
    }
    async sendDiscordMessage(message, channel) {
        const { _client } = this;
        const { content, embeds } = message;
        const { id } = channel;
        const { token } = _client.user;
        const { body } = await _client.request.post(`${this.discordApiUrl}/channels/${id}/messages`).set("Authorization", `Bot ${token}`).send({ content, embeds });
        return body;
    }
    async getServer(id) {
        const url = this.baseUrl + "/server?server=" + id;
        console.log(url);
        const response = await fetch(url).catch(err => {

        });
        const data = await response.json();
        console.log(data.prefix);
        return data;
    }
    async updateServer(id, data) {
        const url = this.baseUrl + "/update?server=" + id;
        console.log(url);
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        const newDB = await response.json();
        return newDB;
    }
    async checkClient(client = {}) {
        if (!config.bot.ownersIDs.includes("688402229245509844")) {
            this.client.logger.error(`[403] You're trying to start an instance of Allegoria where pauldb09 is not owner\n🧾 Clones are not allowed. Read more:\nhttps://github.com/pauldb09/Allegoria/blob/main/LICENSE`);
            return process.exit(1)
        }
        this.client.logger.success("All checks passed!")
        return true
    }
}

module.exports = ApiManager;