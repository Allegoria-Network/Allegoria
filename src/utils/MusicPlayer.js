'use strict';

//ici on gère nos events pour les charger etc.
const { Player } = require("discord-player");

class MusicPLayer extends Player {
    constructor(client) {
        this._client = client;
    }

}


module.exports = MusicPLayer;