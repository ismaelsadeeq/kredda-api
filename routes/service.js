var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/service.controller');

 //Not tested
// service category
router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createServiceCategory
);
router.put('/edit',
  passport.authenticate('jwt',{session:false}),
  controller.editServiceCategory
);
router.get('/all/active',
  passport.authenticate('jwt',{session:false}),
  controller.getAllActiveServiceCategories
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllServiceCategories
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getServiceCategory
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteServiceCategory
);
// service
router.post('/create/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.createService
);
router.put('/edit/service/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.editService
);
router.get('/all/service',
  passport.authenticate('jwt',{session:false}),
  controller.getAllServices
);
router.get('/all/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCategoryServices
);
router.get('/service/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getService
);
router.delete('/service/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteService
);
module.exports = router;
