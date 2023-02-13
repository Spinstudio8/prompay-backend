const mongoose = require('mongoose');

const conn = mongoose.connection;

mongoose.set('strictQuery', true);
module.exports.mongodb = function () {
  const db = process.env.MONGO_URI;

  mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  conn.on('error', (err) =>
    console.error('Could not connect to MongoDB...', err)
  );
  conn.once('open', () => console.log('Connected to MongoDB'));
};

module.exports.conn = conn;
