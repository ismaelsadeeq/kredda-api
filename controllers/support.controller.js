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
  multerConfig.singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
      return res.json(err);
    } else if(req.body){
      const user = req.user;
      const data = req.body;
      const createTicket = await models.ticket.create(
        {
          id:uuid.v4(),
          userId:user.id,
          title:data.title,
          body:data.body,
          status:1
        }
      );
      if(!createTicket){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      req.file ?
      await models.ticket.update(
        {
          attatchment:req.file.path
        },
        {
          where:{
            id:createTicket.id
          }
        }
      ):null
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = createTicket;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const adminReplyToTicket = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(!user){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  multerConfig.singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
      return res.json(err);
    } else if(req.body){
      const data = req.body;
      const ticketId = req.params.ticketId;
      const ticket = await models.ticket.findOne(
        {
          where:{
            id:ticketId
          }
        }
      );
      if(!ticket){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      const reply = await models.ticketReply.create(
        {
          id:uuid.v4(),
          userId:ticket.userId,
          adminId:user.id,
          ticketId:ticketId,
          body:data.body
        }
      );
      if(!reply){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      req.file ?
      await models.ticketReply.update(
        {
          attatchment:req.file.path
        },
        {
          where:{
            id:reply.id
          }
        }
      ):null
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = reply;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const userReplyToTicket = async (req,res)=>{
  multerConfig.singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
      return res.json(err);
    } else if(req.body){
      const data = req.body;
      const user = req.user;
      const ticketId = req.params.ticketId;
      const ticket = await models.ticket.findOne(
        {
          where:{
            id:ticketId
          }
        }
      );
      if(!ticket){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      const reply = await models.ticketReply.create(
        {
          id:uuid.v4(),
          userId:user.id,
          ticketId:ticketId,
          body:data.body
        }
      );
      if(!reply){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      req.file ?
      await models.ticketReply.update(
        {
          attatchment:req.file.path
        },
        {
          where:{
            id:reply.id
          }
        }
      ):null
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = reply;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const getTicketReply = async (req,res)=>{
  const id = req.params.id;
  const ticketReply = await models.ticketReply.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!ticketReply){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = ticketReply;
  return res.json(responseData);
}
const getTicketReplies = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const ticketReplies = await models.ticketReply.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        ticketId:req.params.ticketId
      }
    }
  );
  if(!ticketReplies){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = ticketReplies;
  return res.json(responseData);
}
const getNewTickets = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(!user){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const tickets = await models.ticket.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!tickets){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = tickets;
  return res.json(responseData);
}
const getNewOpenTickets = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(!user){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const tickets = await models.ticket.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        status:1
      }
    }
  );
  if(!tickets){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = tickets;
  return res.json(responseData);
}
const getTickets = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const tickets = await models.ticket.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id
      }
    }
  );
  if(!tickets){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = tickets;
  return res.json(responseData);
}
const getTicket = async (req,res)=>{
  const id = req.params.id;
  const ticket = await models.ticket.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!ticket){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = ticket;
  return res.json(responseData);
}
const closeTicket = async (req,res)=>{
  const id = req.params.id;
  const closeTicket = await models.ticket.update(
    {
      status:0
    },
    {
      where:{
        id:id
      }
    }
  );
  if(!closeTicket){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "ticket closed";
  responseData.data = undefined;
  return res.json(responseData);
}
module.exports = {
  userCreateATicket,
  adminReplyToTicket,
  userReplyToTicket,
  getTicketReply,
  getTicketReplies,
  getNewTickets,
  getNewOpenTickets,
  getTicket,
  closeTicket,
  getTickets
}