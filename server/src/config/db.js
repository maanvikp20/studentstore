require ("dotenv").config();
const mongoose = require("mongoose");

async function connectDB(uri) {
    try{
        console.log(uri)
        await mongoose.connect(uri);
        console.log("MongoDB Connected")
    }catch(err){
        console.log("DB Connection Error:", err)
    }
}

module.exports = connectDB;