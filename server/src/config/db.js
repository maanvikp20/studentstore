const mongoose = require("mongoose");

async function connectDB(uri) {
    try{
        await mongoose.connect(uri);
        console.log("MongoDB Connected")
    }catch(err){
        console.log("DB Connection Error:", err)
    }
}

modules.exports = connectDB;