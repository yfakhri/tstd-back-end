const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGODB_URI_PROD, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

connection
  .then((db) => db)
  .catch((err) => {
    console.log(err);
  });

module.exports = connection;
