const options = require('../middlewares/appSetting');
const models = require('../models');
const paystackApi = require('../utilities/paystack.api')
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

const createTransferRecipient = async (req,res)=>{
  const payment = await options.getPayment();
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(payment.siteName =='paystack'){
    const user = req.user
    const bankId = req.params.bankId
    const bankDetail = await models.bank.findOne(
      {
        where:{
          id:bankId
        }
      }
    );
    if(!bankDetail.recipientCode){
      const payload = {
        name:`${bankDetail.firstName || user.firstName} ${bankDetail.lastName || user.lastName}`,
        accountNumber:bankDetail.accountNumber,
        bankCode:bankDetail.bankCode
      }
      return await paystackApi.createATransferReciepient(payment,payload,user.id,res);
      
    }
    responseData.status = true;
    responseData.message = "Reciepient Code already generated";
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(payment.siteName =='flutterwave'){
    responseData.status = 200;
    responseData.status = false
    responseData.message = "transfer reciepient is appilicable to paystack only";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(payment.siteName =='monnify'){
    responseData.status = 200;
    responseData.status = false
    responseData.message = "transfer reciepient is appilicable to paystack only";
    responseData.data = undefined;
    return res.json(responseData);
  }
}
const initiateATransfer = async (req,res)=>{
  const payment = await options.getPayment();
  const user = req.user
  const data = req.body;
  const bankId = req.params.bankId
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  let amountInNaira = parseFloat(data.amount);
  if(amountInNaira < 0 ){
    responseData.status = true;
    responseData.message = "Cannot withdraw negative amount";
    responseData.data = undefined;
    return res.json(responseData)
  }
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance < parseFloat(data.amount)){
    responseData.status = 200;
    responseData.status = false
    responseData.message = "insufficient funds";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const bankDetail = await models.bank.findOne(
    {
      where:{
        id:bankId
      }
    }
  );
  if(!bankDetail.accountNumber){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "widthrawal account number not added";
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(bankDetail.isAccountValid !== true){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "incorrect account number";
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(payment.siteName =='paystack'){
    if(!bankDetail.recipientCode){
      res.statusCode = 200
      responseData.status = false;
      responseData.message = "recipient code not generated";
      responseData.data = undefined;
      return res.json(responseData)
    }
    await models.wallet.update(
      {
        accountBalance:parseFloat(wallet.accountBalance) - amountInNaira,
      },
      {
        where:{userId:user.id}
      }
    )
    const reciepientCode = await models.bank.findOne(
      {
        where:{
          id:bankId
        },
        attributes:['recipientCode']
      }
    )
    const payload = {
      amount:amountInNaira * 100,
      recipientCode:reciepientCode,
      reason:data.widthrawalReason
    }
    return await paystackApi.initiateATransfer(payment,payload,user.id,res);
    
  }
  if(payment.siteName =='flutterwave'){
    
  }
  if(payment.siteName =='monnify'){
    
  }
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
  getATransactionInfo,

  //widthraw
  createTransferRecipient,
  initiateATransfer
}