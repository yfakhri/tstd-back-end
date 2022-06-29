const { Question, QuestionTC } = require('../models/questions');
const { User } = require('../models/users');

/**
 * TODO: answer count
 *
 */

QuestionTC.addRelation('nQuestion', {
  resolver: () => QuestionTC.mongooseResolvers.dataLoaderMany(),
  prepareArgs: {
    _ids: (source) => source.nextQuestion,
  },
  projection: { nextQuestion: 1 },
});
QuestionTC.addRelation('pQuestion', {
  resolver: () => QuestionTC.mongooseResolvers.dataLoader(),
  prepareArgs: {
    _id: (source) => source.prevQuestion,
  },
  projection: { prevQuestion: 1 },
});
const QuestionQuery = {
  questionById: QuestionTC.mongooseResolvers.findById(),
  questionByIds: QuestionTC.mongooseResolvers.findByIds(),
  questionOne: QuestionTC.mongooseResolvers.findOne(),
  questionMany: QuestionTC.mongooseResolvers.findMany(),
  questionCount: QuestionTC.mongooseResolvers.count(),
  questionConnection: QuestionTC.mongooseResolvers.connection(),
  questionPagination: QuestionTC.mongooseResolvers.pagination(),
  questionAllAnswers: {
    type: '[JSON]',
    args: {},
    resolve: async (source, args, context, info) => {
      const users = await User.find({}, '_id name email').exec();
      const questions = await Question.find({}, ' _id qname answers').exec();
      /* if (questions.length === 0) return null; */
      const answersBody = users.map((user) => {
        const bodyAllAnswer = questions.reduce(
          (acc, question) => {
            const answerQuestion = question._doc.answers.find(
              (element) => element.user.toString() === user._id.toString()
            );
            if (answerQuestion) acc[`${question._id}`] = answerQuestion.answer;
            return acc;
          },
          { ...user._doc }
        );
        return bodyAllAnswer;
      });
      return answersBody;
    },
  },
  questionAllUserAnswers: {
    type: 'JSON',
    args: { userId: 'MongoID!' },
    resolve: async (source, args, context, info) => {
      const user = await User.findById(args.userId, '_id name email').exec();
      const questions = await Question.find({}, ' _id qname answers').exec();
      const answersBody = questions.reduce(
        (acc, question) => {
          const answerQuestion = question._doc.answers.find(
            (element) => element.user.toString() === user._id.toString()
          );
          if (answerQuestion) acc[`${question._id}`] = answerQuestion.answer;
          return acc;
        },
        { ...user._doc }
      );
      return answersBody;
    },
  },
  questionCountAllAnswers: {
    type: '[JSON]',
    args: {},
    resolve: async (source, args, context, info) => {
      const questions = await Question.find(
        {},
        '_id qname qtype answers ansList'
      ).exec();
      if (questions.length === 0) return null;
      const questionFilter = questions.filter(
        (question) => question._doc.ansList.length !== 0
      );
      const questionBody = questionFilter.map((question) => {
        if (question._doc.ansList.length === 0) return null;
        const answersCountBody = question._doc.ansList.map((answerl) => {
          const countResult = question._doc.answers.reduce((acc, answ) => {
            if (answ.answer === answerl) return acc + 1;
            return acc;
          }, 0);
          return { name: answerl, value: countResult };
        });
        return { ...question._doc, answercount: answersCountBody };
      });
      return questionBody;
    },
  },
  questionCountDetail: {
    type: 'JSON',
    args: { questionId: 'MongoID!' },
    resolve: async (source, args, context, info) => {
      try {
        const questionRoot = await Question.findById(
          args.questionId,
          '_id qname ansList qtype answers'
        ).exec();
        if (!questionRoot) return null;
        const questions = await Question.find(
          {
            _id: { $ne: args.questionId },
          },
          '_id qname ansList qtype answers'
        ).exec();
        const questionRootFilter = questionRoot._doc.ansList.map((qr) => {
          const temp = questionRoot._doc.answers.filter(
            (qra) => qra.answer === qr
          );
          const user = temp.map((usr) => usr.user);
          return { answer: qr, user };
        });
        const questionFilter = questions.filter(
          (question) => question._doc.ansList.length !== 0
        );
        const questionBody = questionFilter.map((question) => {
          if (question._doc.ansList.length === 0) return null;
          const keys = [];
          questionRootFilter.forEach((qrf) => {
            keys.push(qrf.answer);
          });
          const answerCountBody = question._doc.ansList.map((answerl) => {
            const finResult = {};
            finResult.id = answerl;
            questionRootFilter.forEach((qrf) => {
              finResult[qrf.answer] = question._doc.answers.reduce(
                (acc, answ) => {
                  if (
                    answ.answer === answerl &&
                    qrf.user.includes(answ.user.toString())
                  )
                    return acc + 1;
                  return acc;
                },
                0
              );
            });
            return finResult;
          });
          return {
            ...question._doc,
            answerdetail: { keys, data: answerCountBody },
          };
        });
        return { title: questionRoot._doc.qname, details: questionBody };
      } catch (error) {
        return null;
      }
    },
  },
};

const QuestionMutation = {
  questionCreateOne: QuestionTC.mongooseResolvers.createOne(),
  questionCreateMany: QuestionTC.mongooseResolvers.createMany(),
  questionUpdateById: QuestionTC.mongooseResolvers.updateById(),
  questionUpdateOne: QuestionTC.mongooseResolvers.updateOne(),
  questionUpdateMany: QuestionTC.mongooseResolvers.updateMany(),
  questionRemoveById: QuestionTC.mongooseResolvers.removeById(),
  questionRemoveOne: QuestionTC.mongooseResolvers.removeOne(),
  questionRemoveMany: QuestionTC.mongooseResolvers.removeMany(),
  questionUpsertAnswer: {
    type: QuestionTC,
    args: { questionId: 'MongoID!', userId: 'MongoID!', answer: 'String!' },
    resolve: async (source, args, context, info) => {
      const filter = {
        _id: args.questionId,
        answers: {
          $elemMatch: {
            user: args.userId,
          },
        },
      };
      const questionUpdt = await Question.updateOne(filter, {
        _id: args.questionId,
        $set: {
          'answers.$.answer': args.answer,
        },
      });
      if (!questionUpdt.nModified) {
        const questionInsrt = await Question.updateOne(
          {
            _id: args.questionId,
          },
          {
            $addToSet: {
              answers: {
                user: args.userId,
                answer: args.answer,
              },
            },
          }
        );
        if (!questionInsrt) return null;
        return Question.findOne({ _id: args.questionId });
      }
      return Question.findOne({ _id: args.questionId });
    },
  },
  questionAdd: {
    type: QuestionTC,
    args: { record: QuestionTC.getInputType() },
    resolve: async (source, args, context, info) => {
      try {
        const newQuestion = new Question({
          qname: args.record.qname,
          qtype: args.record.qtype,
          locked: args.record.locked,
          show: args.record.show,
          prevQuestion: args.record.prevQuestion,
          ansList: args.record.ansList,
        });
        const saveQuestion = await newQuestion.save();
        if (saveQuestion.prevQuestion) {
          const updatePrevQuestion = await Question.updateOne(
            {
              _id: saveQuestion.prevQuestion,
            },
            {
              $addToSet: {
                nextQuestion: saveQuestion._id,
              },
            }
          );
        }
        return Question.findOne({ _id: saveQuestion._id });
      } catch (err) {
        return null;
      }
    },
  },
};

module.exports = { Question, QuestionQuery, QuestionMutation };
