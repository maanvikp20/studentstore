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

router.post("/",    uploadModel.single("file"), createCustomOrder);
router.put("/:id",  updateCustomOrder);
router.delete("/:id", deleteCustomOrder);

module.exports = router;