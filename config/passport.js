const LocalStrategy = require('passport-local').Strategy;

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

module.exports = function (passport) {

    passport.use(new LocalStrategy(
        (username, password, done) => {
            console.log("username: ", username)
            console.log("password: ", password)
            console.log("done: ", done)
            // Match username
            let user = users.find(user => {
                return user.username === username;
            });
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }

            // Match password
            if (user.password !== password) {
                return done(null, false, { message: 'Password incorrect' });
            }

            // Create user
            return done(null, user);
        }
    ));

    passport.serializeUser((user, done) => {
        console.log("serializeUser: ", user)
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log("deserializeUser: ", id)
        let user = users.find(user => {
            return user.id === id;
        });
        done(null, user);
    });

}