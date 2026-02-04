
const Orders = require('../models/Orders');
const Users = require('../models/Users');

// Get all users and orders
async function getAllUsers(req, res, next) {
    try{
        const users = await Users.find({});
        res.json({data: users});
    }catch(err){
        next(err)
    }
}

async function getAllOrders(req, res, next) {
    try{
        const orders = await Orders.find({});
        res.json({data: orders});
    }catch(err){
        next(err)
    }
}

// Get user by ID
async function getUserById(req,res,next){
    try{
        const user = await Users.findById(req.params.id);
        if(!user) return res.status(404).json({message: "User not found"});
        res.json({data: user});
    }catch(err){
        next(err)
    }
}

//Update User
async function updateUser (req, res, next){
    try{
        const updateUser = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updateUser) return res.status(404).json({message: "User not found"});
        res.json({data: updateUser});
    }catch(err){
        next(err)
    }
}

// Delete user and orders
async function deleteUser (req, res, next) {
    try{
        const deleteUser = await Users.findByIdAndDelete(req.params.id);
        if(!deleteUser) return res.status(404).json({message: "User not found"});
        res.json({message: "User deleted successfully"});
    }catch(err){
        next(err)
    }
}

async function deleteOrder (req,res,next) {
    try{
        const deleteOrder = await Orders.findByIdAndDelete(req.params.id);
        if(!deleteOrder) return res.status(404).json({message: "Order not found"});
        res.json({message: "Order deleted successfully"}); 
    }catch(err){
        next(err)
    }
}

module.exports = {getAllUsers, getUserById, updateUser, getAllOrders, deleteUser, deleteOrder};