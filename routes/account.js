var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/account.controller');

router.post('/type',
  passport.authenticate('jwt',{session:false}),
  controller.createAccountType
);
router.put('/type',
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
router.delete('/type/all',
  passport.authenticate('jwt',{session:false}),
  controller.deleteAccountType
);
router.post('/:accountType',
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
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAccount
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.disableAccount
);
module.exports = router;
