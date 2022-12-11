
const TradeOffer = require('../models/tradeOffer');
exports.findByUserIdAndTradeId = (userId, tradeId) => {
  return TradeOffer.findOne({ requestUser: userId, requestTrade: tradeId });
};
exports.findByTradeWithIdOrRequestTradeId = (tradeId) => {
  return TradeOffer.findOne({ $or: [{tradeWith: tradeId}, { requestTrade: tradeId}] }).populate("requestTrade").populate("tradeWith");;
};


exports.findByUserId = (userId) => {
  return TradeOffer.find({ requestUser: userId }).populate("requestTrade");
};
exports.findById = (id) => {
  return TradeOffer.findOne({ _id: id }).populate("requestTrade").populate("tradeWith");
};
exports.save = (offer) => {
  const tradeOffer = new TradeOffer(offer);
  return tradeOffer.save();
}

exports.deleteByRequestTradeIdAndTradeWithId = function (requestTradeId, tradeWithId) {
  return TradeOffer.findOneAndDelete({
    $or: [
        { $and: [{requestTrade: requestTradeId}, { tradeWith:tradeWithId}] },
        { $and: [{requestTrade: tradeWithId}, { tradeWith:requestTradeId}] },
    ]
  });
}
exports.deleteByOwnerIdAndTradeWithId = function (ownerId, tradeWithId) {
  return TradeOffer.findOneAndDelete(
        { $and: [{owner: ownerId}, { tradeWith:tradeWithId}]},
  );
}