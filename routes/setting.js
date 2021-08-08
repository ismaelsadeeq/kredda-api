var express = require('express');
var router = express.Router();
const controller = require('../controllers/setting.controller');
const passport = require('passport');

router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createSetting
);
router.put('/active/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeStatusToActive
);
router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editSetting
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteSetting
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getSettings
);
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getSetting
);
module.exports = router;
