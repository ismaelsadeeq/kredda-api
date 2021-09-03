var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.type.controller.js');

router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.
);

router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createUserCategory
);

router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editUserCategory
);

router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getUserCategories
);

router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.
);
router.get('/partner/:id',
  passport.authenticate('jwt',{session:false}),
  controller.partnerWithCategory
);

module.exports = router;
