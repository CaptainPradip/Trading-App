const User = require('../models/user');
const Trade = require('../models/trades');
const trades_service = require('../services/trades-service');
const tradesOffer_service = require('../services/tradeOffer-service');
const tradesWatch_service = require('../services/tradeWatch-service')
exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then(user => {
            req.flash('success', 'You have successfully registered');
            res.redirect('/users/login');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used');
                return res.redirect('/users/new');
            }

            next(err);
        });
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Wrong email address');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.session.firstName = user.firstName;
                            req.session.lastName = user.lastName;
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'Wrong password');
                            res.redirect('/users/login');
                        }
                    })
                    .catch(err => next(err));;
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([User.findById(id), Trade.find({ owner: id }), tradesOffer_service.findByUserId(id), tradesWatch_service.findByUserId(id)])
        .then(results => {
            const [user, trades, tradesOffers, tradesWatch] = results;
            let categories = trades_service.getCategory();
            res.render('./user/profile', { user, trades, categories, tradesOffers, tradesWatch })
        })
        .catch(err => next(err));
};

exports.showTrades = async (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    let trade = await trades_service.findById(id);
    let categories = trades_service.getCategory();
    if (!trade) {
        let err = new Error('No trades with id ' + id + ' found for the offer');
        err.status = 404;
        next(err);
    } else {
        let availableTrades = await trades_service.findTradesByOwnerIdAndStatus(userId, "Available");
        res.render('./trades/trade-offer', { availableTrades, categories, trade });
    }
};

exports.deleteTrades = async (req, res, next) => {
    let id = req.params.id;
    let tradeOffer = await tradesOffer_service.findByTradeWithIdOrRequestTradeId(id);
    let wishList = await tradesWatch_service.deleteByTradeId(id);
    if(tradeOffer){
        let trade = await tradesOffer_service.deleteByRequestTradeIdAndTradeWithId(tradeOffer.requestTrade._id, tradeOffer.tradeWith._id);
        await trades_service.updateById(tradeOffer.requestTrade._id, { status: "Available" });
        await trades_service.updateById(tradeOffer.tradeWith._id, { status: "Available" });
    }
    trades_service.deleteById(id).then((trade) => {
        if (trade) {
            req.flash('success', 'You have successfully deleted Trade!!!');
            res.redirect('/users/profile');
        }
        else {
            let err = new Error('No trade with id ' + id + ' found to delete');
            err.status = 404;
            next(err);
        }
    }).catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};

exports.makeOffer = async (req, res, next) => {
    let id = req.params.id;
    let tradeId = req.body.id
    let userId = req.session.user;
    try {
        let trade = await trades_service.findById(id);
        if (!trade) {
            let err = new Error('No trades with id ' + id + ' found for the offer');
            err.status = 404;
            next(err);
        } else {
            let newOffer = {
                owner: trade.owner._id,
                requestTrade: req.params.id, // trade with
                tradeWith: tradeId,// selected trade current user available trade
                requestUser: userId,
            }
            let offerTrade = await tradesOffer_service.save(newOffer);
            await trades_service.updateById(id, { status: "Offer Pending" });
            await trades_service.updateById(tradeId, { status: "Offer Pending" });
            req.flash('success', 'You have successfully Requested Trade!!!');
            res.redirect('/users/profile');
        }
    } catch (error) {
        next(error);
    }
};
exports.cancelOffer = async (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    try {
        let tradeOffer = await tradesOffer_service.findById(id);
        console.log(tradeOffer);
        if (tradeOffer && (tradeOffer.owner == userId || tradeOffer.requestUser == userId)) {
            let trade = await tradesOffer_service.deleteByRequestTradeIdAndTradeWithId(tradeOffer.requestTrade._id, tradeOffer.tradeWith._id);
            await trades_service.updateById(tradeOffer.requestTrade._id, { status: "Available" });
            await trades_service.updateById(tradeOffer.tradeWith._id, { status: "Available" });
            req.flash('success', 'You have successfully cancel offer!!!');
            res.redirect('/users/profile');
        } else {
            let err = new Error('Unauthorized to access the resource');
            err.status = 401;
            return next(err);
        }
    } catch (error) {
        next(error);
    }
};

exports.approveOffer = async (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    try {
        let tradeOffer = await tradesOffer_service.findById(id);
        if (tradeOffer && tradeOffer.owner == userId) {
            let trade = await tradesOffer_service.deleteByOwnerIdAndTradeWithId(tradeOffer.owner._id, tradeOffer.tradeWith._id);
            await trades_service.updateById(tradeOffer.requestTrade._id, { status: "Traded" });
            await trades_service.updateById(tradeOffer.tradeWith._id, { status: "Traded" });
            req.flash('success', 'You have successfully approved offer!!!');
            res.redirect('/users/profile');
        } else {
            let err = new Error('Unauthorized to access the resource');
            err.status = 401;
            return next(err);
        }
    } catch (error) {
        next(error);
    }
};
exports.manageOffer = async (req, res, next) => {
    let id = req.params.id;
    try {
        let tradeOffer = await tradesOffer_service.findByTradeWithIdOrRequestTradeId(id);
        if (!tradeOffer) {
            let err = new Error('No offer with id ' + id + ' found for the offer');
            err.status = 404;
            next(err);
        } else {
            res.render('./trades/manage-offer', { tradeOffer });
        }

    } catch (error) {
        err => next(err)
    }
};
exports.removeToWishList = async (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    try {
        let trade = await trades_service.findById(id);
        if (!trade) {
            let err = new Error('No trades with id ' + id + ' found for the wish list');
            err.status = 404;
            next(err);
        } else {
            let wishList = await tradesWatch_service.deleteByIdAndUserId(id,userId);
            req.flash('success', 'You have successfully un wish listed Trade!!!');
            res.redirect('/users/profile');
        }
    } catch (error) {
        next(error);
    }
};


