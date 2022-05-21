var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/account.controller');

router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getDashboard
);

module.exports = router;
