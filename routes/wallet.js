var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/wallet.controller');

router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getWalletBalance
);
router.post('/paystack-webhook',
  controller.webhook
);
router.post('/flutterwave-webhook',
  controller.flutterwaveWebhook
);
router.post('/monnify-webhook',
  controller.monnifyWebhook
);

module.exports = router;
