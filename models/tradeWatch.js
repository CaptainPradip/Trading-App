const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tradeWatchSchema = new Schema({
    watchedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    watchedTrade: { type: Schema.Types.ObjectId, ref: 'Trade' },
},
    { timestamps: true }
);

module.exports = mongoose.model('TradeWatch', tradeWatchSchema);
