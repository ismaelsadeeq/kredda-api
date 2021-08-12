var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/service.controller');

// service category
router.post('/category/create',
  passport.authenticate('jwt',{session:false}),
  controller.createServiceCategory
);
router.put('/category/edit/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editServiceCategory
);
router.get('/category/all/active',
  passport.authenticate('jwt',{session:false}),
  controller.getAllActiveServiceCategories
);
router.get('/category/true/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeServiceCategoryStatusToTrue
);
router.get('/category/false/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeServiceCategoryStatusToFalse
);
router.get('/category/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllServiceCategories
);
router.get('/category/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getServiceCategory
);
router.delete('/category/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteServiceCategory
);
// service
router.post('/create/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.createService
);
router.put('/edit/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.editService
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllServices
);
router.get('/all/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCategoryServices
);
router.get('/active',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCategoryServices
);
router.get('/true/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeStatusToTrue
);
router.get('/false/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeStatusToFalse
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getService
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteService
);
module.exports = router;
