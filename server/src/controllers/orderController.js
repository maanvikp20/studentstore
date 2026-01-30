const Orders = require('../models/Orders');

/**
 * Orders are protected:
 * -user must be authenticated (req.user set by auth middleware)
 * -orders are filtered by customer to prevent access to other's data
 */

// Get ALL
async function getAllOrders(req, res, next) {
  try {
    // Changed 'owner' to 'customer' and fixed .toSorted() to .sort()
    const orders = await Orders.find({customer: req.user.id}).sort({createdAt: -1});
    res.json({data: orders})
  } catch (err) {
    next(err);
  }
}

// GET Specific
async function getOrdersByProduct(req, res, next) {
  try {
    const order = await Orders.findOne({_id: req.params.id, customer: req.user.id})
    if (!order) return res.status(404).json({message: "Order not found"});
    res.json({data: order});
  } catch (err) {
    next(err);
  }
}

// POST
async function createOrder(req, res, next) {
  try {
    const order = new Orders({
      customer: req.user.id,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      orderDetails: req.body.orderDetails
    })
    await order.save();
    res.status(201).json({data: order});
  } catch (err) {
    next(err);
  }
}

// PUT
async function updateOrder(req, res, next) {
  try {
    const updated = await Orders.findOneAndUpdate(
      {_id: req.params.id, customer: req.user.id},
      {
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        orderDetails: req.body.orderDetails
      },
      {new: true} // Return updated document
    )

    if (!updated) return res.status(404).json({message: "Order not found"});
    res.json({data: updated});
  } catch (err) {
    next(err);
  }
}

// DELETE
async function deleteOrder(req, res, next) {
  try {
    const deleted = await Orders.findOneAndDelete({_id: req.params.id, customer: req.user.id})
    if (!deleted) return res.status(404).json({message: "Order not found"});
    res.json({data: deleted});
  } catch (err) {
    next(err);
  }
}

module.exports = {getAllOrders, getOrdersByProduct, createOrder, updateOrder, deleteOrder};