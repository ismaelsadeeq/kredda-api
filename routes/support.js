var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/support.controller');

router.post('/admin/reply',
  passport.authenticate('jwt',{session:false}),
  controller.adminReplyToTicket
);
router.post('/user/reply',
  passport.authenticate('jwt',{session:false}),
  controller.userReplyToTicket
);
router.get('/reply/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTicketReply
);
router.get('/reply',
  passport.authenticate('jwt',{session:false}),
  controller.getTicketReplies
);
router.get('/admin/tiket',
  passport.authenticate('jwt',{session:false}),
  controller.getTickets
);
router.get('/admin/tiket/new',
  passport.authenticate('jwt',{session:false}),
  controller.getNewTickets
);
router.put('/admin/tiket/close',
  passport.authenticate('jwt',{session:false}),
  controller.closeTicket
);
router.get('/tiket/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTicket
);





module.exports = router;
