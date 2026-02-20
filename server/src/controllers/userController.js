const User = require('../models/User');

async function getAllUsers(req, res, next) {
    try{
        const users = await User.find().sort({createdAt: -1}).select('-passwordHash');
        res.json({data: users});
    }catch(err){
        next(err);
    }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({message: "User not found"});
    res.json({data: user});
  } catch (err) {
    next(err);
  }
}

const createUser = async (req, res, next) => {
    try{
        const newUser = new User(req.body);
        await newUser.save();
        
        const userResponse = newUser.toObject();
        delete userResponse.passwordHash;
        
        res.status(201).json({data: userResponse});
    }catch(err){
        next(err);
    }
}

async function updateUser(req, res, next){
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                name: req.body.name,
                email: req.body.email,
                cart: req.body.cart,
            }, 
            {new: true}
        ).select('-passwordHash');
        
        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }
        res.json({data: updatedUser}); // Added response
    }catch(err){
        next(err);
    }
}

async function deleteUser(req, res, next){
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User deleted successfully"});
    }catch(err){
        next(err);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};