var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/account.controller');
const userController =  require('../controllers/user.controller');

router.get('/get/admin/:id', 
  passport.authenticate('jwt',{session:false}),
  controller.getAdminWithId
);
router.post('/type',
  passport.authenticate('jwt',{session:false}),
  controller.createAccountType
);
router.put('/type/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editAccountType
);
router.get('/type/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllAccountTypes
);
router.get('/type/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAccountType
);
router.delete('/type/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteAccountType
);
router.post('/:accountTypeId',
  passport.authenticate('jwt',{session:false}),
  controller.createAccount
);
router.put('/fund/:id',
  passport.authenticate('jwt',{session:false}),
  controller.fundAccount
);
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getAccounts
);
router.get('/admin/:id',
  passport.authenticate('jwt',{session:false}),
  userController.getAccountAdmin
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.disableAccount
);
module.exports = router;
