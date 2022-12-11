const Trade = require('../models/trades');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    } else {
        req.flash('error','You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    } else {
        req.flash('error','You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isOwner = (req, res, next)=>{
    let id = req.params.id;
    Trade.findById(id)
    .then(trade => {
        if(trade){
            if(trade.owner == req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Trade is not found !!! with given ID : '+id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};