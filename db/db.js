const mongoose = require('mongoose');
module.exports = () => {
  return mongoose.connect('mongodb://localhost:27017/Trading_App',
      { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
         console.log("db connected Successfully using mongoose!!")
         mongoose.set('debug', true);
      })
      .catch(err => {
         console.log(err.message)
         throw err;
      }
      );
}
