var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/services.controller');

//Shago

// airtime
router.post('/:serviceId/shago/airtime',
  passport.authenticate('jwt',{session:false}),
  controller.shagoBuyAirtime
);
// data
router.get('/:serviceId/shago/data-lookup',
  passport.authenticate('jwt',{session:false}),
  controller.shagoDataLookup
);
router.post('/:serviceId/shago/data-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.shagoDataPurchase
);
// electricity
router.get('/:serviceId/shago/meter-verification',
  passport.authenticate('jwt',{session:false}),
  controller.shagoMeterVerification
);
router.post('/:serviceId/shago/electricity-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseElectricity
);
// pin
router.get('/shago/waec/pin-look-up',
  passport.authenticate('jwt',{session:false}),
  controller.shagoWaecPinLookup
);
router.post('/:serviceId/shago/waec/purchase',
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
router.post('/:serviceId/shago/jamb/purchase',
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
router.post('/:serviceId/shago/purchase-dstv',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseDstv
);
router.post('/:serviceId/shago/purchase-dstv-addOn',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseDstvWithAddOn
);
router.post('/:serviceId/shago/purchase-startimes',
  passport.authenticate('jwt',{session:false}),
  controller.shagoPurchaseStartimes
);
router.post('/:serviceId/shago/purchase-go-tv',
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
router.post('/:serviceId/mobile-airtime/mtn-vtu',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMtnVtuTopUp
);
router.post('/:serviceId/mobile-airtime/top-up',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeAirtimeTopUp
);
router.get('/mobile-airtime/verify-international',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeVerifyInternationalNumber
);
router.post('/:serviceId/mobile-airtime/recharge-international',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeInternational
);
// data
router.post('/:serviceId/mobile-airtime/data/mtn/gifting',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMtnDataGifting
);
router.post('/:serviceId/mobile-airtime/data/mtn/share',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMtnDataShare
);
router.get('/:serviceId/mobile-airtime/data/mtn/pricing',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeGetDataPricing 
);
router.post('/:serviceId/mobile-airtime/data/top-up',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeDataTopUp
);
// electricity
router.get('/mobile-airtime/disco/lookup',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeGetDiscos
)
router.post('/:serviceId/mobile-airtime/meter/verification',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeMeterVerification
);
router.post('/:serviceId/mobile-airtime/electricity-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeElectricityPurchase
);
// pin
router.post('/:serviceId/mobile-airtime/waec-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeWaecPurchase
);
router.post('/:serviceId/mobile-airtime/neco-purchase',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeNecoPurchase
);
// cable
router.get('/:serviceId/mobile-airtime/cable/info',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeGetCableInfo
);
router.post('/:serviceId/mobile-airtime/recharge/go-tv',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeGoTv
);
router.post('/:serviceId/mobile-airtime/recharge/dstv',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeDstv
);
router.post('/:serviceId/mobile-airtime/recharge/startimes',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeRechargeStartimes
);
//transaction
router.post('/mobile-airtime/transaction/verify/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.mAirtimeVerifyTransaction
);

// Baxi

// airtime
router.post('/:serviceId/baxi/airtime',
  passport.authenticate('jwt',{session:false}),
  controller.baxiPurchaseAirtime
);
// data
router.get('/:serviceId/baxi/data-bundle',
  passport.authenticate('jwt',{session:false}),
  controller.baxiGetDataBundle
);
router.post('/:serviceId/baxi/purchase/data',
  passport.authenticate('jwt',{session:false}),
  controller.baxiPurchaseData
);
// electricity
router.get('/baxi/get/discos',
  passport.authenticate('jwt',{session:false}),
  controller.baxiGetDisco
);
router.get('/baxi/meter/verification',
  passport.authenticate('jwt',{session:false}),
  controller.baxiGetDisco
);
router.post('/baxi/meter-verification',
  passport.authenticate('jwt',{session:false}),
  controller.baxiPurchaseElectricity
);
router.post('/:serviceId/baxi/purchase/electricty',
  passport.authenticate('jwt',{session:false}),
  controller.baxiPurchaseElectricity
);
// pin
router.get('/baxi/pin/get-bundles',
  passport.authenticate('jwt',{session:false}),
  controller.baxiGetPinBundle
);
router.post('/:serviceId/baxi/pin/purchase-pin',
  passport.authenticate('jwt',{session:false}),
  controller.baxiPurchasePin
);
// cable
router.get('/baxi/cable/lookup',
  passport.authenticate('jwt',{session:false}),
  controller.baxiCableLookUp
);
router.get('/baxi/cable-addOn/look-up',
  passport.authenticate('jwt',{session:false}),
  controller.baxiCableAddOnLookUp
);
router.post('/:serviceId/baxi/cable/purchase',
  passport.authenticate('jwt',{session:false}),
  controller.baxiPurchaseCable
);
// transaction
router.get('/baxi/transaction/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.baxiVerifyTransaction
);
module.exports = router;
