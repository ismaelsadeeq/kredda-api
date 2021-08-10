var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/creditCard.controller');

// Not Tested
router.post('/save',
  passport.authenticate('jwt',{session:false}),
  controller.saveCreditCard
);
router.post('/charge-new/:id',
  passport.authenticate('jwt',{session:false}),
  controller.chargeSavedCreditCard
);
router.post('/save/charge',
  passport.authenticate('jwt',{session:false}),
  controller.saveAndChargeCreditCard
);
router.post('/charge/:id',
  passport.authenticate('jwt',{session:false}),
  controller.chargeCreditCard
);
router.post('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCreditCards
);
router.post('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCreditCard
);
router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editCreditCard
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCreditCard
);









module.exports = router;
