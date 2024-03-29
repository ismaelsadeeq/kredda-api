var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/transaction.controller');

router.get('/verify-widthrawal/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.validatePayment
);
router.post('/paystack/create-recipient/:bankId',
  passport.authenticate('jwt',{session:false}),
  controller.createTransferRecipient
);
router.put('/change-status/pending-success/:id',
  passport.authenticate('jwt',{session:false}),
  controller.pendingToSuccess
);
router.put('/change-status/pending-failed/:id',
  passport.authenticate('jwt',{session:false}),
  controller.pendingToFailed
);
router.put('/withdraw-fund/:bankId',
  passport.authenticate('jwt',{session:false}),
  controller.initiateATransfer
);

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
router.get('/service/info/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.getAServiceTransactionInfo
);
router.get('/service/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getServiceTransaction
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

router.get('/user/pending',
  passport.authenticate('jwt',{session:false}),
  controller.pendingTransactions
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.allNewTransactions
);
router.get('/failed',
  passport.authenticate('jwt',{session:false}),
  controller.allFailedTransactions
);
router.get('/success',
  passport.authenticate('jwt',{session:false}),
  controller.allSuccessfulTransactions
);
router.get('/pending',
  passport.authenticate('jwt',{session:false}),
  controller.allPendingTransactions
);
router.get('/reversed',
  passport.authenticate('jwt',{session:false}),
  controller.allReversedTransactions
);
router.get('/info/:reference',
  passport.authenticate('jwt',{session:false}),
  controller.getATransactionInfo
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTransaction
);
router.get('/log/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTransactionLog
);


module.exports = router;