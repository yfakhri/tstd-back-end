const { User, UserTC } = require('../models/users');

const UserQuery = {
  userById: UserTC.mongooseResolvers.findById(),
  userByIds: UserTC.mongooseResolvers.findByIds(),
  userOne: UserTC.mongooseResolvers.findOne(),
  userMany: UserTC.mongooseResolvers.findMany(),
  userCount: UserTC.mongooseResolvers.count(),
  userConnection: UserTC.mongooseResolvers.connection(),
  userPagination: UserTC.mongooseResolvers.pagination(),
};

const UserMutation = {
  userCreateOne: UserTC.mongooseResolvers.createOne(),
  userCreateMany: UserTC.mongooseResolvers.createMany(),
  userUpdateById: UserTC.mongooseResolvers.updateById(),
  userUpdateOne: UserTC.mongooseResolvers.updateOne(),
  userUpdateMany: UserTC.mongooseResolvers.updateMany(),
  userRemoveById: UserTC.mongooseResolvers.removeById(),
  userRemoveOne: UserTC.mongooseResolvers.removeOne(),
  userRemoveMany: UserTC.mongooseResolvers.removeMany(),
  userLogin: {
    type: UserTC,
    args: { name: 'String!', email: 'String!' },
    resolve: async (source, args, context, info) => {
      const users = await User.findOne({ email: args.email });
      if (users) return users;
      const newUser = new User({
        name: args.name,
        email: args.email,
        role: 'user',
        verified: false,
      });
      const saveUser = await newUser.save();
      return saveUser;
    },
  },
};

module.exports = { User, UserQuery, UserMutation };
