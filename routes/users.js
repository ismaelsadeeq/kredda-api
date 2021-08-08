var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.controller');

router.put('/',
  passport.authenticate('jwt',{session:false}),
  controller.updateAccount
);
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getAccount
);
router.delete('/',
  passport.authenticate('jwt',{session:false}),
  controller.deleteAccount
);

module.exports = router;
