const mongoose = require('mongoose');
const Trade = require("./trades")
const Schema = mongoose.Schema;
const tradeOfferSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    tradeWith:{ type: Schema.Types.ObjectId, ref: 'Trade' },
    requestUser:{ type: Schema.Types.ObjectId, ref: 'User' },
    requestTrade:{ type: Schema.Types.ObjectId, ref: 'Trade' },
},
    { timestamps: true }
);
module.exports = mongoose.model('TradeOffer', tradeOfferSchema);

