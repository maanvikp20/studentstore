const Testimonial = require('../models/Testimonials');

async function getAllTestimonials(req, res, next) {
    try{
        const testimonials = await Testimonial.find().sort({createdAt: -1});
        res.json({data: testimonials});
    }catch(err){
        next(err);
    }
}

async function getTestimonialsByProduct(req, res, next) {
  try {
    const testimonials = await Testimonial.find({product: req.params.id})
    if (!testimonials) return res.status(404).json({message: "No testimonials found for this product"});
    res.json({data: testimonials});
  } catch (err) {
    next(err);
  }
}

async function createTestimonial(req, res, next) {
    try{
        const newTestimonial = new Testimonial({
            writer: req.body.writer,
            writerName: req.body.writerName,
            writerEmail: req.body.writerEmail,
            testimonialWritten: req.body.testimonialWritten
        });
        await newTestimonial.save();
        res.status(201).json({data: newTestimonial});
    }catch(err){
        next(err);
    }
}

async function updateTestimonial(req, res, next){
    try{
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id, 
            {
                writer: req.body.writer,
                writerName: req.body.writerName,
                writerEmail: req.body.writerEmail,
                testimonialWritten: req.body.testimonialWritten
            }, 
            {new: true} // Return updated document
        );
        if(!updatedTestimonial){
            return res.status(404).json({message: "Testimonial not found"});
        }
        res.json({data: updatedTestimonial}); // Added response
    }catch(err){
        next(err);
    }
}

async function deleteTestimonial(req, res, next){
    try{
        const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if(!deletedTestimonial){
            return res.status(404).json({message: "Testimonial not found"});
        }
        res.json({message: "Testimonial deleted successfully"}); // Changed from 204 to 200 with message
    }catch(err){
        next(err);
    }
}

module.exports = {
    getAllTestimonials,
    getTestimonialsByProduct,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
};