
var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/bank.controller');


//not tested 
router.post('/fund/:id', 
  passport.authenticate('jwt',{session:false}),
  controller.fundAccount
);
router.post('/enter-pin', 
  passport.authenticate('jwt',{session:false}),
  controller.verifyPaymentWithPin
);
router.post('/enter-otp', 
  passport.authenticate('jwt',{session:false}),
  controller.verifyPaymentWithOtp
);
router.post('/enter-birthday', 
  passport.authenticate('jwt',{session:false}),
  controller.verifyPaymentWithBirthday
);

router.post('/enter-phone', 
  passport.authenticate('jwt',{session:false}),
  controller.verifyPaymentWithPhoneNumber
);

router.post('/enter-address', 
  passport.authenticate('jwt',{session:false}),
  controller.verifyPaymentWithAddress
);
router.post('/check-status',
  passport.authenticate('jwt',{session:false}),
  controller.checkChargeStatus
);
router.post("/",
  passport.authenticate("jwt",{session:false}),
  controller.createBankDetail
);
router.put("/:id",
  passport.authenticate("jwt",{session:false}),
  controller.updateBankDetail
);
router.get("/",
  passport.authenticate("jwt",{session:false}),
  controller.getBankDetails
);
router.get("/:id",
  passport.authenticate("jwt",{session:false}),
  controller.getBankDetail
);
router.delete("/:id",
  passport.authenticate("jwt",{session:false}),
  controller.deleteBankDetail
);

module.exports = router;
