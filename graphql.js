// graphql.js

const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
require('./utils/dbaws');
const schema = require('./schema/scaws');

const server = new ApolloServer({
  schema,
  playground: {
    endpoint: '/dev/graphql',
  },
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
