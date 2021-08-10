var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/loan.controller');

// Not Tested
router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createLoanCategory
);
router.put('/false/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeStatusToFalse
);
router.put('/true/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeStatusToTrue
);
router.put('/edit',
  passport.authenticate('jwt',{session:false}),
  controller.editLoanCategory
);
router.get('/all/active',
  passport.authenticate('jwt',{session:false}),
  controller.getAllActiveLoanCategories
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllLoanCategories
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getLoanCategory
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteLoanCategory
);
module.exports = router;
