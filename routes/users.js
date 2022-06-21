var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.controller');

router.get('/admin',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUsers
);
router.get('/admin/un-active',
  passport.authenticate('jwt',{session:false}),
  controller.getUnActiveUsers
);
router.get('/admin/active',
  passport.authenticate('jwt',{session:false}),
  controller.getActiveUsers
);
router.post('/kyc',
  passport.authenticate('jwt',{session:false}),
  controller.updateKyc
);
router.put('/profile-picture',
  passport.authenticate('jwt',{session:false}),
  controller.updateProfilePicture
);
router.put('/verify-email',
  controller.verifyEmail
);
router.put('/create',
  passport.authenticate('jwt',{session:false}),
  controller.updateAccount
);
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getAccount
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAccountAdmin
);
router.delete('/',
  passport.authenticate('jwt',{session:false}),
  controller.deleteAccount
);

module.exports = router;
