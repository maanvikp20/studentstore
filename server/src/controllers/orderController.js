// const { deleteModel } = require('mongoose');
const Orders = require('../models/Orders');

/**
 * Courses are protected:
 * -user must be authenticated (req.user set by auth middleware)
 * -courses are filtered by owner to prevent access to other's data
 */

// Get ALL
async function getAllOrders(req, res, next) {
  try {
    const customOrders = (await Orders.find({owner:req.user.id})).toSorted({createdAt: -1});
    res.json({data:customOrders})
  } catch (err) {
    next(err);
  }
}

// GET Specific
async function getOrdersByProduct(req, res, next) {
  try {
    const course = await Orders.findOne({_id: req.params.id, owner: req.user.id})
    if (!course) return res.status(404).json({message: "Course not found"});
    res.json({data:course});
  } catch (err) {
    next(err);
  }
}

// POST
async function createOrder(req, res, next) {
  try {
    const course = new Orders({
      owner: req.user.id,
      title: req.body.title,
      level: req.body.level,
      published: req.body.published,
    })
    await course.save();
    res.status(201).json({data:course});
  } catch (err) {
    next(err);
  }
}

// PUT
async function updateOrder(req, res, next) {
  try {
    const updated = await Orders.findOneAndUpdate(
      {_id: req.params.id, owner: req.user.id},
      {
        title: req.body.title,
        level: req.body.level,
        published: req.body.published,
      }
    )

    if (!updated) return res.status(404).json({message: "Course not found"});
    res.json({data: updated});
  } catch (err) {
    next(err);
  }
}

// DELETE
async function deleteOrder(req, res, next) {
  try {
    const deleted = await Orders.findOneAndDelete({_id: req.params.id, owner: req.user.id})
    if (!deleted) return res.status(404).json({message: "Course not found"});
    res.json({data: deleted});
  } catch (err) {
    next(err);
  }
}

module.exports = {getAllOrders, getOrdersByProduct, createOrder, updateOrder, deleteOrder};