const User = require('../models/user');
const Trade = require('../models/trades');

exports.create = (req, res, next)=>{
    let user = new User(req.body);
   return user.save();
};

exports.login = (req, res, next)=>{
    let email = req.body.email;
   return User.findOne({ email: email })
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
  return  Promise.all([User.findById(id), Trade.find({owner: id})])
};




