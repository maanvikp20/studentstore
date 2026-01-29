require("dotenv").config();
const Inventory = require("../models/Inventory");

const getInventory = async (req, res, next) => {
    try{
        const inventoryItems = await Inventory.find();
        res.json(inventoryItems);
    }catch(err){
        next(err)
    }
}

const getInventoryByProduct = async (req, res, next) => {
    try{
        const inventoryItem = await Inventory.findById(req.params.id);
        if(!inventoryItem){
            return res.status(404).json({message: "Inventory item not found"});
        }
        res.json(inventoryItem);
    }catch(err){
        next(err)
    }
}

const createInventory = async (req, res, next) => {
    try{
        const newInventoryItem = new Inventory(req.body);
        await newInventoryItem.save();
        res.status(201).json(newInventoryItem);
    }catch(err){
        next(err)
    }
}

const updateInventory = async (req, res, next) => {
    try{
        const updateInventoryItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!updateInventoryItem){
            return res.status(404).json({message: "Inventory item not found"});
        }
        res.json(updateInventoryItem);
    }catch(err){
        next(err)
    }
}

const deleteInventory = async (req, res, next) => {
    try{
        const deletedInventoryItem = await Inventory.findByIdAndDelete(req.params.id);
        if(!deletedInventoryItem){
            return res.status(404).json({message: "Inventory item not found"});
        }
        res.json({message: "Inventory item deleted successfully"});
    }catch(err){
        next(err)
    }
}

module.exports = {
    getInventory,
    getInventoryByProduct,
    createInventory,
    updateInventory,
    deleteInventory
}