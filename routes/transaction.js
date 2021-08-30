var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/transaction.controller');

router.get('/user',
  passport.authenticate('jwt',{session:false}),
  controller.userNewTransactions
);
router.get('/user/failed',
  passport.authenticate('jwt',{session:false}),
  controller.failedTransactions
);
router.get('/user/success',
  passport.authenticate('jwt',{session:false}),
  controller.successfulTransactions
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getransaction
);
router.get('/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.getATransactionInfo
);
module.exports = router;