const asyncHandler = require("express-async-handler");
const PackingAndMovingOrder = require("../models/PackingAndMovingOrderModel");
const oneSignal = require('@onesignal/node-onesignal');
const PackingAndMovingOrderModel = require("../models/PackingAndMovingOrderModel");


//push notification service setup
const adminAppConfig = oneSignal.createConfiguration({
  appKey: '277ba336-f81d-4a1e-b7cb-4913fceb9ebf',
  restApiKey: 'MWMzODc2YzctOTg3Yy00MjcyLTk0YjYtYzAwZmU2MTYxN2M1',
});

const oneSignalAdminClient = new oneSignal.DefaultApi(adminAppConfig);

async function createAdminAppNotification(name, headings, content, metaData) {
  //the notification

  const notification = new oneSignal.Notification();
  notification.app_id = '277ba336-f81d-4a1e-b7cb-4913fceb9ebf';

  // Name property may be required in some case, for instance when sending an SMS.
  notification.name = name;
  notification.contents = {
      en: content
  }

  // required for Huawei
  notification.headings = {
      en: headings
  }

  notification.data = metaData;
  
  notification.included_segments = ["All"];
  await oneSignalAdminClient.createNotification(notification);
}

//@desc Get all packingAndMovingOrder
//@route GET /api/packingAndMovingOrder
//@access private
const getPackingAndMovingOrders = asyncHandler(async (req, res) => {
  const packingAndMovingOrders = await PackingAndMovingOrderModel.find({user_id:req.user.id});
  res.status(200).json(packingAndMovingOrders);
});

//@desc Create New PackingAndMovingOrder
//@route POST /api/packingAndMovingOrder
//@access private
const createPackingAndMovingOrder = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const name = req.body.name;
  const phone = req.body.phone;
  const recieveAddress = req.body.locationData;
  const itemsToShip = req.body.itemsToShip;
  const totalItems = req.body.totalItems;

  if (!name || !phone || !recieveAddress || !itemsToShip || !totalItems) {
    console.log('Error');
    res.status(400);
  }

  try {
 
    const regex = new RegExp(`^${recieveAddress.startingDistrict.slice(0, 3)}....${recieveAddress.destinationDistrict.slice(0, 3)}$`);
    const results = await PackingAndMovingOrder.find({ orderId: { $regex: regex } });

    var count = 0;

    results.forEach((element) => {
      count++;
    });

    
    const countString = count.toString().padStart(4, "0");
    
    var order = {
      'user_id': req.user.id,
      'orderId': `${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`,
      'name': name,
      'phone': phone,
      'recieveAddress': recieveAddress,
      'itemsToShip': itemsToShip,
      'totalItems': totalItems,
      'status': 'orderPlaced',
    };

    const packingAndMovingOrder = await PackingAndMovingOrder.create(order);

    console.log(packingAndMovingOrder);

    createAdminAppNotification('Manage order', `Order ID : ${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`, 'New packing and moving order', {notificationType: 'newOrder', orderId: `${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`});
    
    res.status(200).json(packingAndMovingOrder);
    res.end();
  } catch (error) {
    console.log(error);
  }
});

//@desc Get PackingAndMovingOrder
//@route GET /api/packingAndMovingOrder/:orderid
//@access private
const getPackingAndMovingOrder = asyncHandler(async (req, res) => {
  const order =  await PackingAndMovingOrderModel.find({user_id:req.user.id});
  //const order = PackingAndMovingOrderModel.findbyId({orderId: {regex: new RegExp(`^${req.body.id}`)}});
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

//@desc Update PackingAndMovingOrder
//@route PUT /api/packingAndMovingOrder/:id
//@access private
const updatePackingAndMovingOrder = asyncHandler(async (req, res) => {
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

//@desc Delete PackingAndMovingOrder
//@route DELETE /api/packingAndMovingOrder/:id
//@access private
const deletePackingAndMovingOrder = asyncHandler(async (req, res) => {
  console.log(`reqest id is : ${req.params.id}`);
  
  try {
    const deletedCount = await PackingAndMovingOrderModel.deleteOne({orderId: req.params.id});
    
    if (deletedCount.deletedCount === 1) res.status(200).json({message:`order : ${req.params.id} removed`});
    else res.status(404).json({message: 'Order not found.'});
    
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

module.exports = {
  getPackingAndMovingOrders,
  createPackingAndMovingOrder,
  getPackingAndMovingOrder,
  updatePackingAndMovingOrder,
  deletePackingAndMovingOrder,
};