const mongoose = require('mongoose');
/* 
* User model for authentication
* password is stored in hashed format. NEVER STORE PLAIN TEXT.
*/

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlenth: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    passwordHash: {type: String, requird: String}
}, {timestamps: true},
)

module.exports = mongoose.model("User", userSchema)