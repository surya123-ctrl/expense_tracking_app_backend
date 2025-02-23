const { users } = require('../dummyData/data');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const userResolver = {
    Query: {
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser();
                return user;

            } catch (error) {
                console.log(error)
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.log(error);
            }
        }
    },

    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input;
                if (!username || !name || !password || !gender) throw new Error('All fields are required!');

                const existingUser = await User.findOne({ username });
                if (existingUser) throw new Error('User Already Exists');
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;
                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === 'male' ? boyProfilePicture : girlProfilePicture
                });
                await newUser.save();
                await context.login(newUser);
                return newUser;
            }
            catch (error) {
                console.log(error);
                // throw new Error(error.message || 'Internal Server Error');
            }
        },
        login: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                const user = await context.authenticate('graphql-local', { username, password });
                await context.login(user);
                return user;
            }
            catch (error) {
                console.log(error);
            }
        },
        logout: async (_, __, context) => {
            try {
                await context.logout();
                req.session.destroy((err) => {
                    if (err) throw err;
                });
                resizeBy.clearCookie('connect_sid');
                return {
                    message: 'logged out successfully'
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = {
    userResolver
}