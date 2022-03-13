const passport = require('passport');
const { Router } = require('express');

module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', function(req, res) {
         res.redirect("https://discord.gg/r8fVHdh5TD")

        });
    }
};

module.exports.name = '/invite';