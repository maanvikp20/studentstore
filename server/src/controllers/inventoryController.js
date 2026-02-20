require("dotenv").config();
const Inventory = require("../models/Inventory");
const { streamToCloudinary } = require("../middleware/upload");

const getInventory = async (req, res, next) => {
  try {
    const inventoryItems = await Inventory.find();
    res.json(inventoryItems);
  } catch (err) {
    next(err);
  }
};

const getInventoryByProduct = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) return res.status(404).json({ message: "Inventory item not found" });
    res.json(inventoryItem);
  } catch (err) {
    next(err);
  }
};

const createInventory = async (req, res, next) => {
  try {
    const fields = { ...req.body };

    if (req.file) {
      fields.imageURL = await streamToCloudinary(req.file.buffer, {
        folder:         "inventory",
        resource_type:  "image",
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      });
    }

    const newItem = new Inventory(fields);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const fields = { ...req.body };

    // If a new image was uploaded, replace with fresh Cloudinary URL
    if (req.file) {
      fields.imageURL = await streamToCloudinary(req.file.buffer, {
        folder:         "inventory",
        resource_type:  "image",
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      });
    }

    const updated = await Inventory.findByIdAndUpdate(req.params.id, fields, { new: true });
    if (!updated) return res.status(404).json({ message: "Inventory item not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteInventory = async (req, res, next) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Inventory item not found" });
    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInventory, getInventoryByProduct, createInventory, updateInventory, deleteInventory };