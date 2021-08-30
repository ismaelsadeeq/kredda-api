const models = require('../models');
const multer = require('multer');
const uuid = require('uuid');
const multerConfig = require('../config/multer');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const userCreateATicket = async (req,res)=>{

}
const adminReplyToTicket = async (req,res)=>{

}
const userReplyToTicket = async (req,res)=>{

}
const getTicketReply = async (req,res)=>{

}
const getTicketReplies = async (req,res)=>{

}
const getNewTickets = async (req,res)=>{

}
const getTickets = async (req,res)=>{

}
const getTicket = async (req,res)=>{

}
const closeTicket = async (req,res)=>{

}
module.exports = {
  userCreateATicket,
  adminReplyToTicket,
  userReplyToTicket,
  getTicketReply,
  getTicketReplies,
  getNewTickets,
  getTickets,
  getTicket,
  closeTicket,
}