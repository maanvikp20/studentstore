const mongoose = require("mongoose");

const CustomOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true },
    orderDetails:  { type: [mongoose.Schema.Types.Mixed], default: [] },

    orderFileURL: { type: String, default: "" },
    gcodeURL:     { type: String, default: null },
    fileName:     { type: String, default: "" },
    fileType:     { type: String, default: "" },  // stl, obj, 3mf, step, stp

    material: {
      type:    String,
      enum:    ["PLA", "PETG", "ABS", "TPU", "ASA", "NYLON", "RESIN"],
      default: "PLA",
    },
    color:    { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1 },
    notes:    { type: String, default: "" },

    sliceStatus: {
      type:    String,
      enum:    ["pending", "slicing", "done", "error", "unsupported"],
      default: "pending",
    },

    estimatedCost: {
      low:       { type: Number, default: 0 },
      high:      { type: Number, default: 0 },
      breakdown: {
        materialCost:  { type: Number, default: 0 },
        laborCost:     { type: Number, default: 0 },
        complexityCost:{ type: Number, default: 0 },
        quantityTotal: { type: Number, default: 0 },
      },
      currency:   { type: String, default: "USD" },
      disclaimer: { type: String, default: "" },
    },

    gcodeStats: {
      printTimeMins:   { type: Number, default: null },
      filamentUsedMm:  { type: Number, default: null },
      filamentUsedG:   { type: Number, default: null },
      layerCount:      { type: Number, default: null },
    },

    confirmedPrice: { type: Number, default: null },

    status: {
      type:    String,
      enum:    ["Pending", "Reviewing", "Quoted", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomOrders", CustomOrderSchema);