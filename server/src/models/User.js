const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    cart: {type: Array, default: []},
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);