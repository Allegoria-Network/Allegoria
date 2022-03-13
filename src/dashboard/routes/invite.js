const passport = require('passport');
const { Router } = require('express');

module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', function(req, res) {
                res.redirect("https://discord.com/oauth2/authorize?client_id=850080680578383872&permissions=412353940808&redirect_uri=https%3A%2F%2Fallegoria.me%2Fgetstarted%2Fthanks&response_type=code&scope=applications.commands%20bot%20identify")

                
        });
    }
};

module.exports.name = '/invite';