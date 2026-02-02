// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Your custom ID (e.g., 'cloth_020')
    category: { type: String, required: true },         // 'clothing', 'wine', 'accessories'
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    summary: { type: String },
    history: { type: String },
    founder: { type: String },
    stock: { type: Number, default: 0 },
    reviews: [
        {
            user: String,
            text: String
        }
    ]
});

module.exports = mongoose.model('product', productSchema);