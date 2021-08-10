var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/wallet.controller');

router.get('/admin',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUsers
);

module.exports = router;
