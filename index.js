const express = require('express');
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

// const demandController = require("./demand.controller");

// demandController.aggregateBuyerDemand("Maize");

const app = express();
const PORT = 3000;

// Define the route for the aggregation
app.get('/api/buyer-demand/aggregate', async (req, res) => {
    const { produce } = req.query; // Get produce type from query parameter

    if (!produce) {
        return res.status(400).json({ error: "Produce type is required" });
    }

    try {
        const results = await BuyerDemand.aggregate([
            {
                $match: { produce: produce }
            },
            {
                $group: {
                    _id: { unit: "$unit", produce: "$produce" },
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        res.json(results); // Send the results as JSON response
    } catch (err) {
        console.error('Error in aggregation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/buyer-demand/save', async (req, res, next) => {
    console.log({ res, res })
    const { buyerId, produce, quantity,
        availability, unit, frequency, isCertified, transportation, country_code, country, location } = req.body; // Get produce type from query parameter



    try {
        const newDemand = new BuyerDemand({
            buyerId: buyerId ?? '6578235da6b5a7a8d3cb52b3',
            produce,
            quantity: quantity,
            availability,
            unit,
            frequency,
            isCertified,
            transportation,
            country_code,
            country,
            location: location ? location.split(';') : [],
        });

        try {
            const result = await newDemand.save();
            res.status(201).json({ message: 'Buyer Demand saved:', result });
        } catch (err) {
            console.log({ err });
            res.status(500).json({ message: 'Error saving buyer demand:', err });
        }

    } catch (err) {
        console.error('Error in aggregation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/buyer-demand/all', async (req, res) => {



    try {
        const { search, frequency, country, produce, unit, transport, location, isCertified } = req.query; // Get produce type from query parameter
        const filter = {};
        if (search) filter.produce = { $regex: search, $options: "i" };
        if (frequency) filter.frequency = { $in: frequency.split(';') };
        if (country) filter.country = { $in: country.split(';') };
        if (produce) filter.produce = { $in: produce.split(';') };
        if (unit) filter.unit = { $in: unit.split(';') };
        if (transport) filter.transport = { $in: transport.split(';') };
        if (location) filter.location = { $in: location.split(';') };
        if (isCertified) filter.isCertified = { $in: isCertified.split(';') };

        const results = await BuyerDemand.find(filter, {});


        res.json({ results }); // Send the results as JSON response
    } catch (err) {
        console.error('Error in aggregation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/buyer-demand/notify', async (req, res) => {



    try {
        const { search, frequency, country, produce, unit, transport, location, isCertified } = req.query; // Get produce type from query parameter
        const filter = {};
        if (search) filter.produce = { $regex: search, $options: "i" };
        if (frequency) filter.frequency = { $in: frequency.split(';') };
        if (country) filter.country = { $in: country.split(';') };
        if (produce) filter.produce = { $in: produce.split(';') };
        if (unit) filter.unit = { $in: unit.split(';') };
        if (transport) filter.transport = { $in: transport.split(';') };
        if (location) filter.location = { $in: location.split(';') };
        if (isCertified) filter.isCertified = { $in: isCertified.split(';') };

        const cursor = await BuyerDemand.find(filter, { buyerId: 1, produce: 1, _id: 0 }).cursor();
        let buyers = [];

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            console.log(doc.buyerId);
            buyers.push(doc.buyerId)

        }

        const notification = `Buyer Notification:${produce ? "\nProduce: " + produce.split(';').join(", ") + ", " : ''}${unit ? "\nUnits: " + unit.split(';').join(", ") + ", " : ''}${isCertified ? "\nCertification: " + isCertified.split(';').join(", ") : ''}`;


        res.json({ buyers, notification }); // Send the results as JSON response
    } catch (err) {
        console.error('Error in aggregation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
