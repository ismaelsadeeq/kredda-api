var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/investment.controller');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createInvestmentPlan
);
router.put('/edit',
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



module.exports = router;
