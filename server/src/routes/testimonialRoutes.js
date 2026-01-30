const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/auth");
const {getAllTestimonials, getTestimonialsByProduct, createTestimonial, updateTestimonial, deleteTestimonial} = require("../controllers/testimonialController.js")

/**
 * Mixed authentication:
 * - GET routes are public (anyone can view testimonials)
 * - POST/PUT/DELETE routes require authentication
 */

// Public routes - no auth required
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialsByProduct);

// Protected routes - auth required
router.post("/", requireAuth, createTestimonial);
router.put("/:id", requireAuth, updateTestimonial);
router.delete("/:id", requireAuth, deleteTestimonial);

module.exports = router;