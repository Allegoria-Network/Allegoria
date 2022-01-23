'use strict';
const fetch = require('node-fetch');
class ApiManager {
    constructor(client) {
        this._client = client;
        this.baseUrl = "https://api.green-bot.app/v2"
        this.discordApiUrl = "https://discordapp.com/api";
    }

    async launch(id, data) {
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
}

module.exports = ApiManager;