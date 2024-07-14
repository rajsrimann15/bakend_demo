const asyncHandler = require("express-async-handler");
const PackingAndMovingOrderModel = require("../models/PackingAndMovingOrderModel");

//@desc Get PackingAndMovingOrder
//@route GET /api/packingAndMovingOrder/
//@access private

const adminGetPackingAndMovingOrders = asyncHandler(async (req, res) => {
    const packingAndMovingOrder = await PackingAndMovingOrderModel.find();
    res.status(200).json(packingAndMovingOrder);
  });

//@desc Get PackingAndMovingOrder
//@route GET /api/packingAndMovingOrder/:orderid
//@access private
const adminGetPackingAndMovingOrder = asyncHandler(async (req, res) => {
  const order =  await PackingAndMovingOrderModel.find({orderId: req.params.id});
  //const order = PackingAndMovingOrderModel.findbyId({orderId: {regex: new RegExp(`^${req.body.id}`)}});
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

//@desc Update order
//@route PUT /api/admin/order/:id
//@access private
const adminUpdatePackingAndMovingOrder = asyncHandler(async (req, res) => {
  if (!req.body.parameter || !req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  console.log(`reqest id is : ${req.params.id}`);
  console.log(`request body is : ${req.body}`);

  try {
    const updatedOrder = await PackingAndMovingOrderModel.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { [req.body.parameter]: req.body.value } },
      { new: true } // Return the updated document
    );
    
    if (updatedOrder) {
      res.status(200).json({message:`${req.body.parameter} changed.`});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

//@desc Delete order
//@route DELETE /api/admin/order/:id
//@access private
const adminDeletePackingAndMovingOrder = asyncHandler(async (req, res) => {
  console.log(`reqest id is : ${req.params.id}`);
  
  try {
    const deletedCount = await PackingAndMovingOrderModel.deleteOne({orderId: req.params.id});
    
    if (deletedCount.deletedCount === 1) res.status(200).json({message:`order : ${req.params.id} removed`});
    else res.status(404).json({message: 'Order not found.'});
    
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

module.exports={adminGetPackingAndMovingOrders, adminGetPackingAndMovingOrder, adminDeletePackingAndMovingOrder, adminDeletePackingAndMovingOrder, adminUpdatePackingAndMovingOrder};