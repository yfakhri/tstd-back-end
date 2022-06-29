const { SchemaComposer } = require('graphql-compose');
const { GraphQLMongoID } = require('graphql-compose-mongoose');
const db = require('../utils/db');
const { UserQuery, UserMutation } = require('./user');
const { QuestionQuery, QuestionMutation } = require('./question');
const { ModuleQuery, ModuleMutation } = require('./module');

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  ...UserQuery,
  ...QuestionQuery,
  ...ModuleQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...QuestionMutation,
  ...ModuleMutation,
});

schemaComposer.createScalarTC(GraphQLMongoID);

module.exports = schemaComposer.buildSchema();
