const asyncHandler = require("express-async-handler");
const oneSignal = require('@onesignal/node-onesignal');
const longDistanceMovingOrderModel = require("../models/LongDistanceMovingOrderModel");


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

//@desc Get all longDistanceMovingOrder
//@route GET /api/longDistanceMovingOrder
//@access private
const getLongDistanceMovingOrders = asyncHandler(async (req, res) => {
  const longDistanceMovingOrders = await longDistanceMovingOrderModel.find({user_id:req.user.userId});
  if(longDistanceMovingOrders) res.status(200).json(longDistanceMovingOrders);
  else res.status(404).json({message:"not found"});
});

//@desc Create New longDistanceMovingOrder
//@route POST /api/longDistanceMovingOrder
//@access private

//sample
// {
//     "sender": {
//       "name": "ronaldo029",
//       "mobileNumber": 9787416631,
//       "location": "Coimbatore",
//       "startingDistrict": "coimbatore",
//       "materialDescription": "wooden logs and steel benches",
//       "weight": 235
//     },
//     "reciever": {
//       "name": "Raj",
//       "mobileNumber": 9999999999,
//       "location": "kolkata",
//       "destinationDistrict": "kolkata",
//       "home-shop-other": "dadcode"
//     },
//     "stoppings": [
//       {
//         "recieverPhone": 3322114455,
//         "location": "mithun house"
//       },
//       {
//         "recieverPhone": 5544887766,
//         "location": "manish house"
//       }
//     ],
//     "requestedVehicle": {
//       "vehicleName": "EICHER 17 FEET",
//       "vehicleDescription": {
//         "length": 17,
//         "width": 6,
//         "height": 6.5,
//         "max_load": 5,
//         "imageUrl": "assets/images/vehicles/eicher_17_feet.png"
//       }
//     }
//   }

const createLongDistanceMovingOrder = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);

  if (!req.body.sender || !req.body.reciever || !req.body.stoppings || !req.body.requestedVehicle) {
    console.log('Some fields are missing');
    res.status(400);
  }

  try {
 
    const regex = new RegExp(`^ldm${req.body.startingDistrict.slice(0, 3)}....${req.body.destinationDistrict.slice(0, 3)}$`);
    const results = await longDistanceMovingOrderModel.find({ orderId: { $regex: regex } });

    var count = 0;

    results.forEach((element) => {
      count++;
    });

    
    const countString = count.toString().padStart(4, "0");
    
    var order = {
      user_id: req.user.userId,
      orderId: `ldm${req.body.startingDistrict.slice(0, 3)}${countString}${req.body.destinationDistrict.slice(0, 3)}`,
      name: req.body.sender.name,
      phone: req.body.sender.phone,
      recieverPhone: req.body.reciever.phone,
      sender: req.body.sender,
      reciever: req.body.reciever,
      stoppings: req.body.stoppings,
      requestedVehicle: req.body.requestedVehicle,
      startingDistrict: req.body.startingDistrict,
      destinationDistrict: req.body.destinationDistrict,
      status: 'orderPlaced',
      statusUpdateLog: {
        orderPlaced: {},
        accepted: {},
        rejected: {},
        orderPicked: {},
        delivered: {}
      }
    };

    const longDistanceOrder = await longDistanceMovingOrderModel.create(order);

    console.log(longDistanceOrder);

    createAdminAppNotification('Manage order', `Order ID : LDM${req.body.startingDistrict.slice(0, 3).toUpperCase()}${countString}${req.body.destinationDistrict.slice(0, 3).toUpperCase()}`, 'New long distance moving order', {notificationType: 'newOrder', orderId: `ldm${req.body.startingDistrict.slice(0, 3)}${countString}${req.body.destinationDistrict.slice(0, 3)}`, orderType: 'longDistanceOrder'});
    
    res.status(200).json(longDistanceOrder);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(501).json({'error': error});
  }
});

//@desc Get longDistanceMovingOrder
//@route GET /api/longDistanceMovingOrder/:orderid
//@access private
const getLongDistanceMovingOrder = asyncHandler(async (req, res) => {
  const order =  await longDistanceMovingOrderModel.find({user_id:req.user.id, orderId: req.params.orderId}, (err, user) => {
    if (err) res.status(501).json({'error': err});
  });
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

//@desc Get longDistanceMovingOrder
//@route GET /api/longDistanceMovingOrder/:orderid
//@access private
const updateLongDistanceMovingOrder = asyncHandler(async (req, res) => {
  if (!req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  try {
    const updatedOrder = await longDistanceMovingOrderModel.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { [`statusUpdateLog.${req.body.value}.viewedByUser`]: true } },
      { new: true } // Return the updated document
    );
    
    if (updatedOrder) {      
      res.status(200).json({message:`${req.body.value} viewed by user.`});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

module.exports = {
    getLongDistanceMovingOrders,
    getLongDistanceMovingOrder,
    createLongDistanceMovingOrder,
    updateLongDistanceMovingOrder
};