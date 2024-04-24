const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// Import ApolloServer class
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express');

// Import the two parts of GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const auth = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = auth.authMiddleware({req}).user;
    return {user};
  }
});


const startApolloServer = async () => {

  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));
  
  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  }
  );
  
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });

};

startApolloServer();
