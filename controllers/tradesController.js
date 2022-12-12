const trades_service = require('../services/trades-service');
const tradesWatch_service = require('../services/tradeWatch-service');
const tradesOffer_service = require('../services/tradeOffer-service')
exports.index = (req, res) => {
    trades_service.find().then((trades) => {
        let categories = trades_service.getCategory();
        res.render('./trades/index', { trades, categories });
    });
};

exports.new = (req, res) => {
    let categories = trades_service.getCategory();
    res.render('./trades/new-trades', { categories: categories });
};

exports.create = (req, res, next) => {
    let trade = req.body;
    trade.imageName = req.file.originalname;
    trade.owner = req.session.user;
    trades_service.save(trade).then((result) => {
        req.flash('success', 'You have successfully created Trade!!!');
        res.redirect('/trades');
    }).catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = async (req, res, next) => {
    let id = req.params.id
    let userId = req.session.user;
    try {
        let watchedTrade = await tradesWatch_service.findByUserIdAndTradeId(userId, id);
        let offeredTrade = await tradesOffer_service.findByUserIdAndTradeId(userId, id);
        let trade = await trades_service.findById(id);
        if (trade) {
            let categories = trades_service.getCategory();
            res.render('./trades/trade', { trade, categories, watchedTrade, offeredTrade });
        } else {
            let err = new Error('No trades with id ' + id + ' found.');
            err.status = 404;
            next(err);
        }
    } catch (error) {
        next(error)
    }

};

exports.edit = (req, res, next) => {
    let id = req.params.id
    trades_service.findById(id).then((trade) => {
        let categories = trades_service.getCategory();
        if (trade) {
            res.render('./trades/edit-trades', { trade, categories });
        } else {
            let err = new Error('No trade with id ' + id + ' found');
            err.status = 404;
            next(err);
        }
    }).catch(err => next(err));

};

exports.update = (req, res, next) => {
    let updateTrade = {
        category:req.body.category,
        title:req.body.title,
        price:req.body.price,
        details:req.body.details
    }
    if (req.file && req.file.originalname) {
        updateTrade.imageName = req.file.originalname;
    }
    let id = req.params.id;
    trades_service.updateById(id, updateTrade).then((trade) => {
        if (trade) {
            req.flash('success', 'You have successfully updated Trade!!!');
            res.redirect('/trades/' + id);
        } else {
            let err = new Error('No trades with id ' + id + ' found to update.');
            err.status = 404;
            next(err);
        }
    }).catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });

};

exports.delete = async (req, res, next) => {
    let id = req.params.id;
    let tradeOffer = await tradesOffer_service.findByTradeWithIdOrRequestTradeId(id);
    let wishList = await tradesWatch_service.deleteByTradeId(id);
    if(tradeOffer){
        let trade = await tradesOffer_service.deleteByRequestTradeIdAndTradeWithId(tradeOffer.requestTrade._id, tradeOffer.tradeWith._id);
        await trades_service.updateById(tradeOffer.requestTrade._id, { status: "Available" });
        await trades_service.updateById(tradeOffer.tradeWith._id, { status: "Available" });
    }
    trades_service.deleteById(id).then(async (trade) => {
        if (trade) {
            req.flash('success', 'You have successfully deleted Trade!!!');
            res.redirect('/trades');
        }
        else {
            let err = new Error('No trade with id ' + id + ' found to delete');
            err.status = 404;
            next(err);
        }
    }).catch(err => next(err));

};

exports.addToWishList = async (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    try {
        let trade = await trades_service.findById(id);
        if (!trade) {
            let err = new Error('No trades with id ' + id + ' found for the wish list');
            err.status = 404;
            next(err);
        } else {
            let newWishList = {
                watchedBy: userId,
                watchedTrade: id
            }
            let wishList = await tradesWatch_service.save(newWishList);
            req.flash('success', 'You have successfully wish listed Trade!!!');
            res.redirect('/trades/' + id);
        }
    } catch (error) {
        next(error);
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
            let wishList = await tradesWatch_service.deleteByIdAndUserId(id, userId);
            req.flash('success', 'You have successfully un wish listed Trade!!!');
            res.redirect('/trades/' + id);
        }
    } catch (error) {
        next(error);
    }
};