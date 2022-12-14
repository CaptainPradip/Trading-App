const TradeWatch = require('../models/tradeWatch');
exports.findByUserIdAndTradeId = (userId, tradeId) => {
  return TradeWatch.findOne({ watchedBy: userId, watchedTrade: tradeId });
};
exports.findByUserId = (id) => {
  return TradeWatch.find({ watchedBy: id }).populate("watchedTrade");
}

exports.save = (newWatch) => {
  const tradeWatch = new TradeWatch(newWatch);
  return tradeWatch.save();
}

exports.deleteById = (id) => {
  return TradeWatch.findByIdAndDelete(id);
}
exports.deleteByIdAndUserId = (tradeId, userId) => {
  return TradeWatch.deleteMany({ watchedTrade: tradeId, watchedBy: userId });
}
exports.deleteByTradeId = (tradeId) => {
  return TradeWatch.deleteMany({ watchedTrade: tradeId });
}
