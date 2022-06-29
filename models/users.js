const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      trim: true,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('users', UserSchema);
const UserTC = composeMongoose(User);

module.exports = {
  UserSchema,
  User,
  UserTC,
};
