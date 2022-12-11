const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tradeSchema = new Schema({
    category: { type: String, required: [true, 'category is is required'] },
    title: { type: String, required: [true, 'title is required'] },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    details: {
        type: String, required: [true, 'details is required'],
        minLength: [10, 'the content should have at least 10 characters']
    },
    imageName: {
        type: String, required: [true, 'image is required']
    },
    status: {
        type: String,
        default: "Available", required: [true, 'Status is required'],
        enum: ['Available', 'Offer Pending', 'Traded']
    },
    price: {
        type: Number, required: [true, 'price is required'],
        min: [0, "Please add the price more than 0, got {VALUE}'"]
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Trade', tradeSchema);

