const Auth0Strategy = require('passport-auth0');

module.exports = function (passport) {

    console.log("=================================================")
    console.log("process.env.AUTH0_DOMAIN: ", process.env.AUTH0_DOMAIN)
    console.log("process.env.AUTH0_CLIENT_ID: ", process.env.AUTH0_CLIENT_ID)
    console.log("process.env.AUTH0_CLIENT_SECRET: ", process.env.AUTH0_CLIENT_SECRET)
    console.log("process.env.AUTH0_CALLBACK_URL: ", process.env.AUTH0_CALLBACK_URL)
    console.log("=================================================")
    passport.use(new Auth0Strategy({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
        (accessToken, refreshToken, extraParams, profile, done) => {
            return done(null, profile);
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        // User.findById(id, (err, user) => {
        done(null, user);
        // });
    });
}