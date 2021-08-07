var express = require('express');
var router = express.Router();
const controller = require('../controllers/admin.controller');
const passport = require('passport');

router.get('/', 
  passport.authenticate('jwt',{session:false}),
  controller.getAdmin
);

router.post('/login', 
  controller.adminLogin
);

router.post('/verify',
  controller.verifyEmail
)

router.post('/send-code',
  controller.sendCode
)
router.post('/reset-password',
  controller.resetPassword
)
router.post('/change-password', 
  passport.authenticate('jwt',{session:false}),
  controller.changePassword
);
router.get('/logout', 
  passport.authenticate('jwt',{session:false}),
  controller.logout
);
router.post('/super', 
  controller.createSuperAdmin
);
router.post('/', 
  controller.createAdmin
);
router.put('/edit-priority/:adminId', 
  passport.authenticate('jwt',{session:false}),
  controller.editAdminPrioriy
);
router.put('/profile-picture', 
  passport.authenticate('jwt',{session:false}),
  controller.editProfilePicture
);
router.put('/', 
  passport.authenticate('jwt',{session:false}),
  controller.editAdmin
);
router.delete('/', 
  passport.authenticate('jwt',{session:false}),
  controller.deleteAdmin
);

module.exports = router;
