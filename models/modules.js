const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const QuestionSchema = new mongoose.Schema({
  qname: {
    type: String,
    trim: true,
    required: true,
  },
  qtype: {
    type: String,
    trim: true,
    required: true,
  },
  ansList: {
    type: [String],
    trim: true,
  },
  answers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

const ModuleSchema = new mongoose.Schema(
  {
    mname: {
      type: String,
      trim: true,
      required: true,
    },
    locked: {
      type: Boolean,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
    prevModules: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'modules',
    },
    nextModules: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'modules',
    },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model('module', ModuleSchema);
const ModuleTC = composeMongoose(Module);

module.exports = {
  ModuleSchema,
  Module,
  ModuleTC,
};
