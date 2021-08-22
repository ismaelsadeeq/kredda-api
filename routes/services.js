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
//transaction 
router.post('/shago/verify/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.shagoVerifyTransaction
);
// Mobile airtime

// airtime
router.post('/mobile-airtime/mtn-vtu',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMtnVtuTopUp
);
router.post('/mobile-airtime/top-up',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeAirtimeTopUp
);
router.get('/mobile-airtime/verify-international',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeVerifyInternationalNumber
);
router.post('/mobile-airtime/recharge-international',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeInternational
);
// data
router.post('/mobile-airtime/data/mtn/gifting',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMtnDataGifting
);
router.get('/mobile-airtime/data/mtn/share',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMtnDataShare
);
router.get('/mobile-airtime/data/mtn/pricing',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeGetDataPricing 
);
router.post('/mobile-airtime/data/top-op',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeDataTopUp
);
// electricity
router.get('/mobile-airtime/disco/lookup',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeGetDiscos
)
router.post('/mobile-airtime/meter/verification',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMeterVerification
);
router.post('/mobile-airtime/electricity-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeElectricityPurchase
);
// pin
router.get('/mobile-airtime/waec-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeWaecPurchase
);
router.post('/mobile-airtime/neco-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeNecoPurchase
);
// cable
router.get('/mobile-airtime/cable/info',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeGetCableInfo
);
router.post('/mobile-airtime/recharge/go-tv',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeGoTv
);
router.post('/mobile-airtime/recharge/dstv',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeDstv
);
router.post('/mobile-airtime/recharge/startimes',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeStartimes
);
// Baxi
// airtime

// data

// electricity

// pin

// cable

module.exports = router;
