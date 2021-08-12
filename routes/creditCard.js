var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/creditCard.controller');

// Not Tested
router.post('/charge/:id',
  passport.authenticate('jwt',{session:false}),
  controller.chargeSavedCreditCard
);
router.post('/paystack-initiate/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.chargeSavedCreditCard
);
router.post('/charge-default',
  passport.authenticate('jwt',{session:false}),
  controller.chargeDefaultCreditCard
);
router.post('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCreditCards
);
router.post('/default/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeToDefault
);
router.post('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCreditCard
);
router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editCreditCard
);
router.put('verify/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.verifyTransaction
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCreditCard
);









module.exports = router;
