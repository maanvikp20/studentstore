const express = require("express");
const router  = express.Router();

const { requireAuth }  = require("../middleware/auth");
const { uploadModel }  = require("../middleware/upload");
const {
  getAllCustomOrders, getSpecificCustomOrder,
  createCustomOrder, updateCustomOrder, deleteCustomOrder
} = require("../controllers/customOrderController");

router.use(requireAuth);

router.get("/",    getAllCustomOrders);
router.get("/:id", getSpecificCustomOrder);

// uploadModel.single("file") parses the multipart body and puts the
// 3D model in req.file. Other form fields arrive in req.body as usual.
router.post("/",    uploadModel.single("file"), createCustomOrder);
router.put("/:id",  updateCustomOrder);
router.delete("/:id", deleteCustomOrder);

module.exports = router;