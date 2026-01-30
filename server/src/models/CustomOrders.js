const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    customerName: { type: String, required: true, trim: true, maxlenth: 80 },
    customerEmail: { type: String, required: true, lowercase: true, trim: true}, // Removed unique: true
    orderDetails: {type: Array, required: true, unique: false, lowercase: true, trim: true},
    orderFileURL: {type: String, required: true, unique: false, lowercase: true, trim: true}
}, {timestamps: true},
)

module.exports = mongoose.model("CustomOrders", customOrderSchema)