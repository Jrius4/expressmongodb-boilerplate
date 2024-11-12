// frombuyers
const mongoose = require('mongoose');
const BuyerDemand = require('./demands.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/frombuyers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});


const demandsController = {
    aggregateBuyerDemand: async (produceType) => {
        try {
            const results = await BuyerDemand.aggregate([
                // Stage 1: Filter documents by `produce`
                {
                    $match: { produce: produceType }
                },
                // Stage 2: Group by `unit` and `produce`, and calculate the sum of `quantity`
                {
                    $group: {
                        _id: { unit: "$unit", produce: "$produce" },
                        totalQuantity: { $sum: "$quantity" }
                    }
                }
            ]);

            console.log('Aggregation Results:', results);
            return results;
        } catch (err) {
            console.error('Error in aggregation:', err);
        }
    },
    createBuyerDemand: async () => {
        const newDemand = new BuyerDemand({
            buyerId: '12345',
            produce: 'Tomatoes',
            quantity: 1000,
            availability: 'Immediate',
            unit: 'kg',
            frequency: 'Weekly',
            isCertified: 'Yes',
            transportation: 'Refrigerated',
            country_code: 'US',
            country: 'United States',
            location: ['California', 'New York']
        });

        try {
            const result = await newDemand.save();
            console.log('Buyer Demand saved:', result);
        } catch (err) {
            console.error('Error saving buyer demand:', err);
        }
    }

}

module.exports = demandsController;

