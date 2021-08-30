var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/transaction.controller');

router.get('/service/user',
  passport.authenticate('jwt',{session:false}),
  controller.userNewServiceTransactions
);
router.get('/service/user/failed',
  passport.authenticate('jwt',{session:false}),
  controller.failedServiceTransactions
);
router.get('/service/user/success',
  passport.authenticate('jwt',{session:false}),
  controller.successfulServiceTransactions
);
router.get('/service/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getServiceTransaction
);
router.get('/service/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.getAServiceTransactionInfo
);
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
router.get('/info/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.getATransactionInfo
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTransaction
);
module.exports = router;