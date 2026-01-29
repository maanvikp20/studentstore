const { deleteModel } = require('mongoose');
const CustomOrders = require('../models/CustomOrders');

/**
 * CustomOrders are protected:
 * -user must be authenticated (req.user set by auth middleware)
 * -CustomOrders are filtered by owner to prevent access to other's data
 */


async function getAllCustomOrders(req, res, next) {
  try {
    const customOrders = (await CustomOrders.find({owner:req.user.id})).toSorted({createdAt: -1});
    res.json({data:customOrders})
  } catch (err) {
    next(err);
  }
}


async function getSpecificCustomOrder(req, res, next) {
  try {
    const CustomOrder = await CustomOrder.findOne({_id: req.params.id, owner: req.user.id})
    if (!CustomOrder) return res.status(404).json({message: "CustomOrder not found"});
    res.json({data:CustomOrder});
  } catch (err) {
    next(err);
  }
}

// POST /api/CustomOrders
async function createCustomOrder(req, res, next) {
  try {
    const customOrder = new CustomOrders({
      owner: req.user.id,
      title: req.body.title,
      level: req.body.level,
      published: req.body.published,
    })
    await customOrder.save();
    res.status(201).json({data:customOrder});
  } catch (err) {
    next(err);
  }
}

// PUT /api/CustomOrders/:id
async function updateCustomOrder(req, res, next) {
  try {
    const updated = await CustomOrders.findOneAndUpdate(
      {_id: req.params.id, owner: req.user.id},
      {
        title: req.body.title,
        level: req.body.level,
        published: req.body.published,
      }
    )

    if (!updated) return res.status(404).json({message: "CustomOrder not found"});
    res.json({data: updated});
  } catch (err) {
    next(err);
  }
}

// DELETE /api/CustomOrders/:id
async function deleteCustomOrder(req, res, next) {
  try {
    const deleted = await CustomOrders.findOneAndDelete({_id: req.params.id, owner: req.user.id})
    if (!deleted) return res.status(404).json({message: "CustomOrder not found"});
    res.json({data: deleted});
  } catch (err) {
    next(err);
  }
}

module.exports = {getAllCustomOrders, getSpecificCustomOrder, createCustomOrder, updateCustomOrder, deleteCustomOrder};