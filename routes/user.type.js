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
router.get('/admin/get/:id',
  passport.authenticate('jwt',{session:false}),
  controller.adminGetPartnerWithCategory
);
router.get('/get',
  passport.authenticate('jwt',{session:false}),
  controller.userGetPartnerWithCategory
);
router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createUserCategory
);

router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editUserCategory
);
router.get('/specific/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getUserOfCategories
);
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getUserCategories
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUserOfCategories
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteUserCategory
);

module.exports = router;
