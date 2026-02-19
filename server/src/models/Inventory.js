const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName:      { type: String, required: true, trim: true, maxlength: 80 },
  itemPrice:     { type: Number, required: true },
  amountInStock: { type: Number, required: true, default: 0 },
  filament: {
    type: String,
    required: true,
    enum: ["PLA", "PETG", "ABS", "TPU", "ASA", "NYLON", "RESIN"],
  },
  imageURL:    { type: String, trim: true, default: "" },  // no longer required — Cloudinary handles it
  description: { type: String, default: "" },
  color:       { type: String, default: "" },
  category:    { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);