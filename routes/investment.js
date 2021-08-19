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
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllInvestmentPlan
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getInvestmentPlan
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteInvestmentPlan
);
router.post('/:planId',
  passport.authenticate('jwt',{session:false}),
  controller.invest
)
router.get('/user',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUserInvestments
);
router.get('/user/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getInvestment
);
module.exports = router;
