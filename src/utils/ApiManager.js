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
        return true
    }
}

module.exports = ApiManager;