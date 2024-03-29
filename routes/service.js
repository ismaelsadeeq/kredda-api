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
router.put('/category/edit/picture/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editServiceCategoryPicture
);
router.get('/category/active/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllActiveServiceCategories
);
router.get('/category/unactive/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUnactiveServiceCategories
);
router.put('/category/true/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeServiceCategoryStatusToTrue
);
router.put('/category/false/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeServiceCategoryStatusToFalse
);
router.get('/category/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllServiceCategories
);
router.get('/category/all/active',
  passport.authenticate('jwt',{session:false}),
  controller.getAllActiveServiceCategories
);
router.get('/category/all/unactive',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUnactiveServiceCategories
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
router.put('/edit/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editService
);
router.put('/edit/picture/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editServicePicture
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
  controller.getAllActiveService
);
router.get('/unactive',
  passport.authenticate('jwt',{session:false}),
  controller.getAllUnactiveService
);
router.put('/true/:id',
  passport.authenticate('jwt',{session:false}),
  controller.changeStatusToTrue
);
router.put('/false/:id',
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
