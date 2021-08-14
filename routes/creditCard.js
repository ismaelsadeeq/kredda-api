var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/creditCard.controller');

router.post('/charge/:id',
  passport.authenticate('jwt',{session:false}),
  controller.chargeSavedCreditCard
);
router.post('/paystack-initiate/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.initiateCardChargePaystack
);
router.post('/charge-default',
  passport.authenticate('jwt',{session:false}),
  controller.chargeDefaultCreditCard
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCreditCards
);
router.put('/default/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeToDefault
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCreditCard
);
router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editCreditCard
);
router.put('/verify/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.verifyTransaction
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCreditCard
);









module.exports = router;
