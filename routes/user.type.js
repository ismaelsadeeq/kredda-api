var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.type.controller.js');

router.post('/partner/:id',
  passport.authenticate('jwt',{session:false}),
  controller.partnerWithCategory
);
router.get('/check/:id',
  passport.authenticate('jwt',{session:false}),
  controller.checkPartnerWithCategory
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
  controller.deleteUserCategory
);

module.exports = router;
