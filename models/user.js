const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'Please Enter the First Name!!!']},
    lastName: {type: String, required: [true, 'Please Enter the Last name !!!']},
    email: { type: String, required: [true, 'Please Enter the Email!!!'], unique: [true, 'email is not available !!!'] },
    password: { type: String, required: [true, 'Please Enter the Password!!!'] },
});

userSchema.pre('save', function(next){
  let user = this;
  if (!user.isModified('password'))
      return next();
  bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash;
    next();
  })
  .catch(err => next(error));
});
/**
 * this method used to check password
 * @param {*} inputPassword 
 * @returns 
 */
userSchema.methods.comparePassword = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
}
module.exports = mongoose.model('User', userSchema);