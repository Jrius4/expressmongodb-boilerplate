const mongoose = require('mongoose');

const demands = new mongoose.Schema({
    buyerId: { type: String, required: true, index: true },
    produce: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    availability: { type: String, required: true, index: true },
    unit: { type: String },
    frequency: { type: String, index: true },
    isCertified: { type: String, index: true },
    transportation: { type: String },
    country_code: { type: String, index: true },
    country: { type: String, index: true },
    location: { type: [String] },
}, { timestamps: true });

// Create the model
const BuyerDemand = mongoose.model('demands', demands);

module.exports = BuyerDemand;
