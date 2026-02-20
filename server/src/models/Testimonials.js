const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    writer: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    writerName: { type: String, required: true, trim: true, maxlenth: 80 },
    writerEmail: { type: String, required: true, lowercase: true, trim: true},
    testimonialWritten: {type: String, required: true, unique: false, lowercase: true, trim: true}
}, {timestamps: true},
)

module.exports = mongoose.model("Testimonial", testimonialSchema)