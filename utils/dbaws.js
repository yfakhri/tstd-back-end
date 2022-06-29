const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(
  'mongodb://usr:3wX3bOAtJXM1QGb4@tstdcluster-shard-00-00.few4y.mongodb.net:27017,tstdcluster-shard-00-01.few4y.mongodb.net:27017,tstdcluster-shard-00-02.few4y.mongodb.net:27017/tstd?replicaSet=atlas-3c7qmo-shard-0&ssl=true&authSource=admin',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  }
);

connection
  .then((db) => db)
  .catch((err) => {
    console.log(err);
  });

module.exports = connection;
