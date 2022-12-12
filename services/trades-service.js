const Trade = require('../models/trades');
const categories = {
    CleaningSupplies: "Cleaning Supplies",
    Furniture: "Furniture",
    Appliances: "Appliances",
    Electronic_Equipment: "Electronic Equipment",
    Carpets: "Carpets",
    Cooking_Eating_Utensils: "Cooking and eating utensils",
    Dishes: "Dishes"
}

exports.find = () => {
    return Trade.find();
};

exports.getCategory = () => {
    return categories;
}
exports.findById = (id) => {
    return Trade.findById(id).populate('owner', '_id firstName lastName');
};

exports.save = (trade) => {
    const tradeModel = new Trade(trade)
    return tradeModel.save();
}

exports.updateById = (id, newTrade) => {
    return Trade.findByIdAndUpdate(id, newTrade, { useFindAndModify: false, runValidators: true })
}

exports.findTradesByOwnerIdAndStatus = (id,status) => {
    return Trade.find({ owner: id ,status:status});
}

exports.deleteById = function (id) {
    return Trade.findOneAndDelete({ _id: id });
}