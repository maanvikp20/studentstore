const CustomOrders = require('../models/CustomOrders');

/**
 * CustomOrders are protected:
 * -user must be authenticated (req.user set by auth middleware)
 * -CustomOrders are filtered by customer to prevent access to other's data
 */

async function getAllCustomOrders(req, res, next) {
  try {
    // Changed 'owner' to 'customer' to match schema
    const customOrders = await CustomOrders.find({customer: req.user.id}).sort({createdAt: -1});
    res.json({data: customOrders})
  } catch (err) {
    next(err);
  }
}

async function getSpecificCustomOrder(req, res, next) {
  try {
    // Fixed variable name and changed 'owner' to 'customer'
    const customOrder = await CustomOrders.findOne({_id: req.params.id, customer: req.user.id})
    if (!customOrder) return res.status(404).json({message: "Custom order not found"});
    res.json({data: customOrder});
  } catch (err) {
    next(err);
  }
}

// POST /api/custom-orders
async function createCustomOrder(req, res, next) {
  try {
    const customOrder = new CustomOrders({
      customer: req.user.id, // Changed from 'owner' to 'customer'
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      orderDetails: req.body.orderDetails,
      orderFileURL: req.body.orderFileURL
    })
    await customOrder.save();
    res.status(201).json({data: customOrder});
  } catch (err) {
    next(err);
  }
}

// PUT /api/custom-orders/:id
async function updateCustomOrder(req, res, next) {
  try {
    const updated = await CustomOrders.findOneAndUpdate(
      {_id: req.params.id, customer: req.user.id},
      {
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        orderDetails: req.body.orderDetails,
        orderFileURL: req.body.orderFileURL
      },
      {new: true} // Return updated document
    )

    if (!updated) return res.status(404).json({message: "Custom order not found"});
    res.json({data: updated});
  } catch (err) {
    next(err);
  }
}

// DELETE /api/custom-orders/:id
async function deleteCustomOrder(req, res, next) {
  try {
    const deleted = await CustomOrders.findOneAndDelete({_id: req.params.id, customer: req.user.id})
    if (!deleted) return res.status(404).json({message: "Custom order not found"});
    res.json({data: deleted});
  } catch (err) {
    next(err);
  }
}

module.exports = {getAllCustomOrders, getSpecificCustomOrder, createCustomOrder, updateCustomOrder, deleteCustomOrder};