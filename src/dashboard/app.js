morgan = require("morgan");
const passport = require('passport');
const { Strategy } = require('passport-discord');

module.exports.load = async(client, config = {}) => {
    console.log(config)
    const express = require("express"),
        session = require("express-session"),
        path = require("path"),
        app = express();
    const indexRoute = require("./routes/index")
    const CommandRoute = require("./routes/commands")
    const InviteRoute = require("./routes/invite")
    const Invalid = require("./routes/404")
    const getStarted = require("./routes/getstarted")
    const AuthRoute = require("./routes/auth")
    const ProfileRoute = require("./routes/profile")
    const ClanRoute = require("./routes/clan")
    const discordRouter = require("./routes/discord")

    app.use(morgan('dev'))
        .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        .use(express.static(path.join(__dirname, "/public")))
        .set("views", path.join(__dirname, "/views"))
        .set("port", config.port)

    .use(session({
            secret: `allegoria.me_${Date.now()}_pauldb09_own_${Date.now()}`,
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
            req.config = client.config;
            req.bot = client;
            next();
        })
        .use("/", new indexRoute.Router())
        .use("/commands", new CommandRoute.Router())
        .use("/invite", new InviteRoute.Router())
        .use("/getstarted", new getStarted.Router())
        .use("/auth", new AuthRoute.Router())
        .use("/profile", new ProfileRoute.Router())
        .use("/c", new ClanRoute.Router())
        .use("/discord", new discordRouter.Router())
        .use("*", new Invalid.Router());
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });
    passport.use(new Strategy({
        clientID: "850080680578383872",
        clientSecret: "Secret",
        callbackURL: "https://allegoria.me/auth/login",
        scope: ['identify']
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    app.listen(config.port, () => {
        console.log("Allegoria dashboard is listening on port " + config.port);
    });
    client.dashboardReady = true;
};