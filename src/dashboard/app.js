morgan = require("morgan");
const passport = require('passport');
const { Strategy } = require('passport-discord');

module.exports.load = async(client) => {

    /* Init express app */
    const express = require("express"),
        session = require("express-session"),
        path = require("path"),
        app = express();

    /* Routers */
    const a = require("./routes/index")
        /* App configuration */
    app
        .use(morgan('dev'))

    // Set the engine to html (for ejs template)
    .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        // Set the css and js folder to ./public
        .use(express.static(path.join(__dirname, "/public")))
        // Set the ejs templates to ./views
        .set("views", path.join(__dirname, "/views"))
        // Set the dashboard port
        .set("port", 80)
        // Set the express session password and configuratio

    .use(session({
            secret: `ey.${Date.now()}$AZza${Date.now()}`,
            resave: false,
            saveUninitialized: false
        }))
        .use(express.json())
        .use(express.urlencoded({ extended: false }))
        .use(passport.initialize())
        .use(passport.session())
        .use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Credentials', true);
            req.config = this.config;
            req.bot = client;
            next();
        })
        .use("/", new a.Router())

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });
    passport.use(new Strategy({
        clientID: "783708073390112830",
        clientSecret: "OLfh_1WGdospojspkqf_XueF5_VmdTg3",
        callbackURL: `https://allegoria.me/api/login`,
        scope: ['identify', 'guilds']
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    // Listen
    app.listen(app.get("port"), () => {
        console.log("Allegoria dashboard is listening on port " + app.get("port"));
    });
    client.dashboardReady = true;
};