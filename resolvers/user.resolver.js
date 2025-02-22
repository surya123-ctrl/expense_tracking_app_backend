const {users} = require('../dummyData/data')
const userResolver = {
    Query: {
        users: () => {
            return users;
        },

        user: (_, {userId}) => users.find((item) => item._id === userId)
    }
}

module.exports = {
    userResolver
}