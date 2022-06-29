const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const QuestionSchema = new mongoose.Schema(
  {
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
    locked: {
      type: Boolean,
      required: true,
    },
    prevQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'questions',
    },
    nextQuestion: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'questions',
    },
    show: {
      type: Boolean,
      required: true,
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
  },
  {
    timestamps: true,
  }
);
const Question = mongoose.model('question', QuestionSchema);
const QuestionTC = composeMongoose(Question);

module.exports = {
  QuestionSchema,
  Question,
  QuestionTC,
};
