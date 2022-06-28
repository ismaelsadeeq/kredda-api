var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/kyc.controller');

router.get('/all/un-verified',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUnverified
);
router.get('/all/verified',
  passport.authenticate('jwt',{session:false}),
  controller.getAllVerified
);
router.get('/all/rejected',
  passport.authenticate('jwt',{session:false}),
  controller.getAllRejected
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllKyc
);
router.get('/user/:userId',
  passport.authenticate('jwt',{session:false}),
  controller.getUserKyc
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getKyc
);
router.put('/verify/:id',
  passport.authenticate('jwt',{session:false}),
  controller.verifyKyc
);
router.put('/un-verify/:id',
  passport.authenticate('jwt',{session:false}),
  controller.unVerifyKyc
);
module.exports = router;
