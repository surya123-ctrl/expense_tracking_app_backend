const { ApolloServer } = require('@apollo/server');
const express = require('express');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
const { mergedResolvers } = require('./resolvers/index');
const { mergedTypeDefs } = require('./typedefs/index');

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: mergedTypeDefs,
        resolvers: mergedResolvers,
    });

    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use("/graphql", expressMiddleware(server));
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}

startServer().catch(err => console.error("Server startup error:", err));