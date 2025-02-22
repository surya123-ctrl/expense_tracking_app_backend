const passport = require('passport');
const bcrypt = require('bcryptjs');
const {GraphQLLocalStrategy} = require('graphql-passport');

const User = require('../models/user.model');

const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        console.log('Serializing User');
        done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
        console.log('Deserializing User');
        try {
            const user = await User.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({username});
                if(!user) throw new Error('Invalid username');
                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword) throw new Error('Invalid password')
                    return done(null, user);
            }
            catch(error) {
                return done(error)
            }
        })
    )
}

module.exports = {
    configurePassport
}