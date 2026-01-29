const mongoose = require('mongoose');
/* 
* User model for authentication
* password is stored in hashed format. NEVER STORE PLAIN TEXT.
*/

const orderSchema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    customerName: { type: String, required: true, trim: true, maxlenth: 80 },
    customerEmail: { type: String, required: true, unique: true, lowercase: true, trim: true},
    orderDetails: {type: Array, required: true, unique: false, lowercase: true, trim: true}
}, {timestamps: true},
)

module.exports = mongoose.model("Order", orderSchema)