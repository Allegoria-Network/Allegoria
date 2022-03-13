const passport = require('passport');
const { Router } = require('express');
module.exports.Router = class Auth extends Router {
    constructor() {
        super();
        this.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), async(req, res, next) => {
            const callback = req.query.callback
            let Url;
            console.log(callback)
            switch (callback) {
                case "thanks":
                    Url = "/getstarted/thanks"
                    break;
                case "simple":
                    Url = "/profile"
                    break;
                case "join":
                    Url = "/c/" + callback.replace("join.", "") + ""
                    break;
                default:
                    Url = "/"
                    break;
            }
            res.status(200).redirect(Url);
            next();
        });
        this.get('/logout', function(req, res) {
            if (!req.user) return res.status(200).redirect('/');

            req.logout();
            res.status(200).redirect('/getstarted/logout');
        });
    }
};

module.exports.name = '/auth';