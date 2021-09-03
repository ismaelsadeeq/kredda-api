var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.type.controller.js');

router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.
);


module.exports = router;
