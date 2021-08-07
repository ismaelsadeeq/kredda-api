var express = require('express');
var router = express.Router();
const controller = require('../controllers/auth.controller');
const passport = require('passport');

router.post('/checker',
  controller.checker
);
router.post('/otp',
  controller.checkOtp
);
router.post('/confirm-password',
  controller.setPassword
);
router.post('/reset-password',
  passport.authenticate('jwt',{session:false}),
  controller.changePassword
);
router.post('/forgot-password',
  controller.forgetPassword
);
router.post('/login',
  controller.login
);
router.post('/enter-auth-code',
  controller.enter2FACode
);


module.exports = router;
