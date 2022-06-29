var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/support.controller');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.userCreateATicket
);
router.post('/admin/reply/:ticketId',
  passport.authenticate('jwt',{session:false}),
  controller.adminReplyToTicket
);
router.post('/user/reply/:ticketId',
  passport.authenticate('jwt',{session:false}),
  controller.userReplyToTicket
);
router.get('/reply/:ticketId',
  passport.authenticate('jwt',{session:false}),
  controller.getTicketReplies
);
router.get('/reply/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTicketReply
);
router.get('/admin/tiket/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllTickets
);
router.get('/admin/tiket/open',
  passport.authenticate('jwt',{session:false}),
  controller.getNewOpenTickets
);
router.get('/admin/tiket/closed',
  passport.authenticate('jwt',{session:false}),
  controller.getClosedTickets
);
router.get('/user/tiket',
  passport.authenticate('jwt',{session:false}),
  controller.getTickets
);
router.put('/admin/tiket/close/:id',
  passport.authenticate('jwt',{session:false}),
  controller.closeTicket
);
router.get('/tiket/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getTicket
);





module.exports = router;
