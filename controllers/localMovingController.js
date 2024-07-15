const asyncHandler = require("express-async-handler");
const localMovingModel = require("../models/LocalMovingOrderModel");
const oneSignal = require('@onesignal/node-onesignal');



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
const getLocalMovingOrders = asyncHandler(async (req, res) => {
  const localDistanceMovingOrders = await localMovingModel.find({user_id:req.user.id});
  res.status(200).json(localDistanceMovingOrders);
});

//@desc Create New PackingAndMovingOrder
//@route POST /api/packingAndMovingOrder
//@access private

//sample
// {
//     "sender": {
//       "name": "ronaldo029",
//       "mobileNumber": 9787416631,
//       "location": "Coimbatore",
//       "materialDescription": "wooden logs and steel benches",
//       "weight": 235
//     },
//     "reciever": {
//       "name": "Raj",
//       "mobileNumber": 9999999999,
//       "location": "kolkata",
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

const createLocaleMovingOrder = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);

  if (!req.body.sender || !req.body.reciever || !req.body.stoppings || !req.body.requestedVehicle) {
    console.log('Some fields are missing');
    res.status(400);
  }

  try {
 
    const regex = new RegExp(`^${req.body.sender.location.slice(0, 3)}....${req.body.reciever.location.slice(0, 3)}$`);
    const results = await localMovingModel.find({ orderId: { $regex: regex } });

    var count = 0;

    results.forEach((element) => {
      count++;
    });

    
    const countString = count.toString().padStart(4, "0");
    
    var order = {
      user_id: req.user.id,
      orderId: `${req.body.sender.location.slice(0, 3)}....${req.body.reciever.location.slice(0, 3)}`,
      name: req.body.sender.name,
      phone: req.body.sender.mobileNumber,
      sender: req.body.sender,
      reciever: req.body.reciever,
      stoppings: req.body.stoppings,
      requestedVehicle: req.body.requestedVehicle,
      status: 'orderPlaced'
    };

    const localanceOrder = await localMovingModel.create(order);

    console.log(localDistanceOrder);

    createAdminAppNotification('Manage order', `Order ID : ${req.body.sender.location.slice(0, 3)}${countString}${req.body.reciever.location.slice(0, 3)}`, 'New local distance moving order', {notificationType: 'newOrder', orderId: `${req.body.sender.location.slice(0, 3)}${countString}${req.body.reciever.location.slice(0, 3)}`, orderType: 'localDistanceOrder'});
    
    res.status(200).json(localDistanceOrder);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(501).json({'error': error});
  }
});

//@desc Get PackingAndMovingOrder
//@route GET /api/packingAndMovingOrder/:orderid
//@access private
const getLocalMovingOrder = asyncHandler(async (req, res) => {
  const order =  await localMovingModel.find({user_id:req.user.id, orderId: req.params.orderId}, (err, user) => {
    if (err) res.status(501).json({'error': err});
  });
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

module.exports = {
    getLocalMovingOrders,
    getLocalMovingOrder,
    createLocaleMovingOrder
};