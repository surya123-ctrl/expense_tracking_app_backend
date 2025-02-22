const { ApolloServer } = require('@apollo/server');
const express = require('express');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
const env = require('dotenv');
const {connectDb} = require('./db/connectDb');
const { mergedResolvers } = require('./resolvers/index');
const { mergedTypeDefs } = require('./typedefs/index');
env.config();
async function startServer() {
    try {
        await connectDb();
    }
    catch(error) {
        console.log(error.message)
    }

    const app = express();
    const server = new ApolloServer({
        typeDefs: mergedTypeDefs,
        resolvers: mergedResolvers,
    });

    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use("/graphql", expressMiddleware(server));
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}

startServer().catch(err => console.error("Server startup error:", err));