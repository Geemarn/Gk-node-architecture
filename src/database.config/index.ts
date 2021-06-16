import mongoose from 'mongoose';
import config from 'config';

export default () => {
  //use mongoose promise
  mongoose.Promise = Promise;

  mongoose.connection.on('disconnected', function () {
    console.debug('Mongoose connection to mongodb shell disconnected');
  });

  let databaseUrl = config.get('databases.mongodb.test') as string;
  //use db when in test environment
  if (config.get('app.environment') === 'test') {
    databaseUrl = config.get('databases.mongodb.test') as string;
  }

  // return promise after connection to db
  return mongoose
    .connect(databaseUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
}
