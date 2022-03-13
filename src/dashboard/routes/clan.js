const passport = require('passport');
const { Router } = require('express');

module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/:clanID', async function(req, res) {

            const clanID = req.params.clanID
            if (!req.user) return res.redirect(`https://allegoria.me/auth/login&callback=join.${clanID}`)
            let UserAvatar;
            if (req.user) {

                if (req.user.avatar) {
                    UserAvatar = `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`;

                } else {
                    UserAvatar = "https://www.pikpng.com/pngl/b/326-3268299_blue-default-discord-avatar-clipart.png";

                }
            } else {
                UserAvatar = "https://www.pikpng.com/pngl/b/326-3268299_blue-default-discord-avatar-clipart.png";
            }
            const clan = await req.bot.database.getClan(clanID)

            console.log(clan)
            res.status(200).render('clan.ejs', {
                bot: req.bot.user,
                clan: clan,
                user: req.user,
                client: req.bot,
                isMember: clan.members.includes(`${req.user.id}`) ? "true" : "false",
                UserAvatar,
                is_logged: (req.isAuthenticated())
            });
        });
        this.get('/:clanID/home', async function(req, res) {
            const clanID = req.params.clanID
            if (!req.user) return res.redirect(`https://allegoria.me/auth/login&callback=join.${clanID}`)
            let UserAvatar;
            if (req.user) {

                if (req.user.avatar) {
                    UserAvatar = `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`;

                } else {
                    UserAvatar = "https://www.pikpng.com/pngl/b/326-3268299_blue-default-discord-avatar-clipart.png";

                }
            } else {
                UserAvatar = "https://www.pikpng.com/pngl/b/326-3268299_blue-default-discord-avatar-clipart.png";
            }
            const clan = await req.bot.database.getClan(clanID)

            console.log(clan)
            res.status(200).render('clanhome.ejs', {
                bot: req.bot.user,
                clan: clan,
                user: req.user,
                client: req.bot,
                isMember: clan.members.includes(`${req.user.id}`) ? "true" : "null",
                UserAvatar,
                is_logged: (req.isAuthenticated())
            });
        });
    }
};

module.exports.name = '/clan';