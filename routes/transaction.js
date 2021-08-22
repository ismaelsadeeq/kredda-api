var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/transaction.controller');

router.get('/user-new-transactions',
  passport.authenticate('jwt',{session:false}),
  controller.userNewTransactions
);
router.get('/user-transactions',
  passport.authenticate('jwt',{session:false}),
  controller.userTransaction
);
router.get('/transaction',
  passport.authenticate('jwt',{session:false}),
  controller.getransaction
);
router.get('/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.getATransactionInfo
);