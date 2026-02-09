const mongoose = require('mongoose');
/* 
* User model for authentication
* password is stored in hashed format. NEVER STORE PLAIN TEXT.
*/

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true, trim: true, maxlenth: 80 },
    itemPrice: { type: Number, required: true,},
    amountInStock: {type: Number, required: true},
    filament: {type: String, required: true, enum:["PLA", "PETG", "ABS"]},
    imageURL: {type: String, required: true, trim:true}
}, {timestamps: true},
)


module.exports = mongoose.model("Inventory", inventorySchema)