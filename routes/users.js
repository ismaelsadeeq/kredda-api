var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.controller');

router.put('/profile-picture',
  passport.authenticate('jwt',{session:false}),
  controller.updateProfilePicture
);
router.put('/verify-email',
  passport.authenticate('jwt',{session:false}),
  controller.verifyEmail
);
router.put('/create',
  passport.authenticate('jwt',{session:false}),
  controller.updateAccount
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAccount
);
router.delete('/',
  passport.authenticate('jwt',{session:false}),
  controller.deleteAccount
);

module.exports = router;
