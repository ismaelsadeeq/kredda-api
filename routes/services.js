var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/services.controller');

//Shago
// airtime
router.post('/shago/airtime',
  passport.authenticate('jwt',{session:false}),
  controller.shagoBuyAirtime
);
// data
router.get('/shago/data-lookup',
  passport.authenticate('jwt',{session:false}),
  controller.shagoDataLookuo
);
router.post('/shago/data-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.shagoDataLookup
);
// electricity
router.post('/shago/meter-verification',
  passport.authenticate('jwt',{session:false}),
  controller.shagoMeterVerification
);
router.post('/shago/electricity-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseElectricity
);
// pin
router.get('/shago/waec/look-up',
  passport.authenticate('jwt',{session:false}),
  controller.shagoWaecPinLookup
);
router.post('/shago/waec/purchase',
  passport.authenticate('jwt',{session:false}),
  controller.shagoWaecPinPurchase
);
router.get('/shago/jamb/look-up',
  passport.authenticate('jwt',{session:false}),
  controller.shagoJambLookUp
);
router.get('/shago/jamb/verification',
  passport.authenticate('jwt',{session:false}),
  controller.shagoJambVerification
);
router.get('/shago/jamb/purchase',
  passport.authenticate('jwt',{session:false}),
  controller.shagoJambPurchase
);
// cable
router.get('/shago/cable-lookup',
  passport.authenticate('jwt',{session:false}),
  controller.shagoCableLookup
);
router.get('/shago/cable-bouquote-lookup',
  passport.authenticate('jwt',{session:false}),
  controller.shagoCableBouquoteLookup
);
router.get('/shago/dstv-addOn',
  passport.authenticate('jwt',{session:false}),
  controller.shagoGetDstvAddOn
);
router.post('/shago/purchase-dstv',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseDstv
);
router.post('/shago/purchase-dstv-addOn',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseDstvWithAddOn
);
router.post('/shago/purchase-startimes',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseStartimes
);
router.post('/shago/purchase-go-tv',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseGoTv
);
// Mobile airtime

// airtime
// router.post('/',
//   passport.authenticate()
//   controller.
// );
// data

// electricity

// pin

// cable

// Baxi
// airtime
// router.post('/',
//   passport.authenticate()
//   controller.
// );
// data

// electricity

// pin

// cable
module.exports = router;
