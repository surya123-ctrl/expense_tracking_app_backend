const { ApolloServer } = require('@apollo/server');
const express = require('express');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
const env = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const {buildContext} = require('graphql-passport');
const connectMongo = require('connect-mongodb-session');
const {connectDb} = require('./db/connectDb');
const { mergedResolvers } = require('./resolvers/index');
const { mergedTypeDefs } = require('./typedefs/index');
const {configurePassport} = require('./passport/passport.config');
env.config();
configurePassport();
async function startServer() {
    try {
        await connectDb();
    }
    catch(error) {
        console.log(error.message)
    }
    const MongoDbStore = connectMongo(session);
    const store = new MongoDbStore({
        uri: process.env.MONGO_URI,
        collection: 'sessions'
    });
    store.on('error', (err) => console.log(err));
    const app = express();
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true
            },
            store: store
        })
    )

    app.use(passport.initialize());
    app.use(passport.session());
    const server = new ApolloServer({
        typeDefs: mergedTypeDefs,
        resolvers: mergedResolvers,
    });

    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use(
        "/graphql", 
        cors({
            origin: 'http://localhost:3000',
            credentials: true
        }),
        expressMiddleware(server, {
            context: async ({req, res}) => buildContext({req, res})
        })
    );
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}

startServer().catch(err => console.error("Server startup error:", err));