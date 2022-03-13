'use strict';
class ApiManager {
    constructor(client) {
        this._client = client;
    }

    async launch(options = {}) {
        if (this._client.shard.ids[0] == 0) {
            if (this._client.dashboardReady) return this._client.logger.error("[Dashboard] Already spawned")
            const dash = require("../dashboard/app")
            console.log(options)
            await dash.load(this._client, options)
        }
    }
}

module.exports = ApiManager;