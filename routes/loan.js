var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/loan.controller');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createLoanCategory
);
router.put('/edit',
  passport.authenticate('jwt',{session:false}),
  controller.editLoanCategory
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllLoanCategory
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getLoanCategoty
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteLoanCategory
);
module.exports = router;
