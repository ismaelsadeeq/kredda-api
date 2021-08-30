const models = require('../models');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const userNewServiceTransactions = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const transactions = await models.serviceTransaction.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id,
      }
    }
  );
  if(!transactions){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transactions;
  return res.json(responseData);
}
const failedServiceTransactions = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const transactions = await models.serviceTransaction.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id,
        status:"failed"
      }
    }
  );
  if(!transactions){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transactions;
  return res.json(responseData);
}
const successfulServiceTransactions = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const transactions = await models.serviceTransaction.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id,
        status:"successful"
      }
    }
  );
  if(!transactions){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transactions;
  return res.json(responseData);
}
const getServiceTransaction = async (req,res)=>{
  const id = req.params.id;
  const transaction = await models.serviceTransaction.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!transaction){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transaction;
  return res.json(responseData);
}
const getAServiceTransactionInfo = async (req,res)=>{
  const reference = req.params.reference;
  const transaction = await models.serviceTransaction.findOne(
    {
      where:{
        reference:reference
      }
    }
  );
  if(!transaction){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transaction;
  return res.json(responseData);
}

const userNewTransactions = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id,
      }
    }
  );
  if(!transactions){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transactions;
  return res.json(responseData);
}
const failedTransactions = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id,
        status:"failed"
      }
    }
  );
  if(!transactions){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transactions;
  return res.json(responseData);
}
const successfulTransactions = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:req.user.id,
        status:"successful"
      }
    }
  );
  if(!transactions){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transactions;
  return res.json(responseData);
}
const getTransaction = async (req,res)=>{
  const id = req.params.id;
  const transaction = await models.transaction.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!transaction){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transaction;
  return res.json(responseData);
}
const getATransactionInfo = async (req,res)=>{
  const reference = req.params.reference;
  const transaction = await models.transaction.findOne(
    {
      where:{
        reference:reference
      }
    }
  );
  if(!transaction){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = transaction;
  return res.json(responseData);
}
module.exports = {
  //service 
  userNewServiceTransactions,
  failedServiceTransactions,
  successfulServiceTransactions,
  getServiceTransaction,
  getAServiceTransactionInfo,

  userNewTransactions,
  failedTransactions,
  successfulTransactions,
  getTransaction,
  getATransactionInfo
}