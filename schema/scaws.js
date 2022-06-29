const { SchemaComposer } = require('graphql-compose');
const { GraphQLMongoID } = require('graphql-compose-mongoose');
const db = require('../utils/dbaws');
const { UserQuery, UserMutation } = require('./user');
const { QuestionQuery, QuestionMutation } = require('./question');

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...QuestionQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...QuestionMutation,
});

schemaComposer.createScalarTC(GraphQLMongoID);

module.exports = schemaComposer.buildSchema();
