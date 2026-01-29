const mongoose = require('mongoose');


const customOrderSchema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    customerName: { type: String, required: true, trim: true, maxlenth: 80 },
    customerEmail: { type: String, required: true, unique: true, lowercase: true, trim: true},
    orderDetails: {type: Array, required: true, unique: false, lowercase: true, trim: true},
    orderFileURL: {type: String, required: true, unique: false, lowercase: true, trim: true}
}, {timestamps: true},
)

export default customOrderSchema