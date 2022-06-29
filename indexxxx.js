const dotenv = require('dotenv');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('./utils/db');
const schema = require('./schema');

dotenv.config();

const server = new ApolloServer({
  schema,
  cors: true,
  playground: process.env.NODE_ENV === 'development',
  introspection: true,
  tracing: true,
  path: '/api',
});

const app = express();
server.applyMiddleware({
  app,
  path: '/api',
  cors: true,
});

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`
  Now browse to http://localhost:${4000}${server.graphqlPath}`)
);
