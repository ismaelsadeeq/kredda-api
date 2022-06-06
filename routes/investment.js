var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/investment.controller');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createInvestmentPlan
);
router.put('/edit/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editInvestmentPlan
);
router.put('/deactivate/plan/:id',
  passport.authenticate('jwt',{session:false}),
  controller.restoreInvestmentPlan
);
router.put('/restore/plan/:id',
  passport.authenticate('jwt',{session:false}),
  controller.restoreInvestmentPlan
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteInvestmentPlan
);
router.post('/:planId',
  passport.authenticate('jwt',{session:false}),
  controller.invest
)
router.get('/user/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getInvestment
);
router.get('/user-all/:planId',
  passport.authenticate('jwt',{session:false}),
  controller.getAllPlanInvestments
);
router.get('/user-all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllInvestments
);
router.get('/user',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUserInvestments
);
router.get('/all/active',
  passport.authenticate('jwt',{session:false}),
  controller.getAllInvestmentPlan
);
router.get('/all/unactive',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUnactiveInvestmentPlan
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getInvestmentPlan
);
module.exports = router;
