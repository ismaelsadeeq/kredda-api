const options = require('../middlewares/appSetting');
const models = require('../models');
const paystackApi = require('../utilities/paystack.api');
const flutterwaveApi = require('../utilities/flutterwave.api');
const monnifyApi = require('../utilities/monnify.api');
const helpers = require('../utilities/helpers');
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
const pendingServiceTransactions = async (req,res)=>{
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
        status:"pending"
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
const pendingTransactions = async (req,res)=>{
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
        status:"pending"
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
const allNewTransactions = async (req,res)=>{
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']]
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
const allFailedTransactions = async (req,res)=>{
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
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
const allSuccessfulTransactions = async (req,res)=>{
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
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
const allPendingTransactions = async (req,res)=>{
  const transactions = await models.transaction.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        status:"pending"
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
  let amountInNaira = parseInt(data.amount);
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
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < parseInt(data.amount)){
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
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `TRF-${digits}${firstDigit}`
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
        accountBalance:parseInt(wallet.accountBalance) - amountInNaira,
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
    let totalServiceFee = amountInNaira + parseInt(process.env.WIDTHRAW_CHARGE);
    const payload = {
      amount:amountInNaira * 100,
      recipientCode:reciepientCode,
      reason:data.widthrawalReason,
      totalServiceFee:totalServiceFee * 100,
      trxRef:trxRef
    }
    return await paystackApi.initiateATransfer(payment,payload,user.id,res);
  }
  if(payment.siteName =='flutterwave'){
    await models.wallet.update(
      {
        accountBalance:parseInt(wallet.accountBalance) - amountInNaira,
      },
      {
        where:{userId:user.id}
      }
    )
    const payload = {
      bankCode:bankDetail.bankCode,
      accountNumber:bankDetail.accountNumber,
      narration:data.widthrawalReason,
      trxRef:trxRef,
      amount:data.amount,
      userId:user.id
    }
    return await flutterwaveApi.initiateATransfer(payment,payload,res);
  }
  if(payment.siteName =='monnify'){
    await models.wallet.update(
      {
        accountBalance:parseInt(wallet.accountBalance) - amountInNaira,
      },
      {
        where:{userId:user.id}
      }
    )
    const payload = {
      name:`${bankDetail.firstName || user.firstName} ${bankDetail.lastName || user.lastName}`,
      bankCode:bankDetail.bankCode,
      accountNumber:bankDetail.accountNumber,
      narration:data.widthrawalReason,
      trxRef:trxRef,
      amount:data.amount,
      userId:user.id
    }
    return await monnifyApi.initiateATransfer(payload,payment,res);
  }
}
const validatePayment = async (req,res)=>{
  const reference = req.params.reference;
  if(!reference){
    responseData.status = false;
    responseData.message ="reference is required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payment = await options.getPayment();
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(payment.siteName =="paystack"){
    let payload = {
      reference:reference
    };
    return paystackApi.verifyTransfer(payment,payload,res);
  }
  if(payment.siteName =="flutterwave"){
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:reference
        }
      }
    );
    let payload = {
      id:transaction.beneficiary
    };
    return flutterwaveApi.validateTransfer(payment,payload,res);
  }
  if(payment.siteName =="monnify"){
    let payload = {
      reference:reference
    };
    return await monnifyApi.getTransfer(payload,payment,res);
  }
}
const checkAdmin = async (req)=>{
  const id = req.params.id
  const admin = await models.admin.findOne({
    where:{
      id:req.user.id
    }
  })
  if(!admin){
    return false;
  }
  return true
}
const pendingToSuccess = async (req,res)=>{
  const isAdmin = await checkAdmin(req)
  if(!isAdmin){
    res.statusCode = 401;
    return res.json('Unauthorize');
  }
  const transaction = await models.transaction.findOne({
    where:{
      id:req.params.id
    }
  });
  if(transaction){
    await models.transaction.update(
      {
        status:'successful'
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    responseData.status = true;
    responseData.message = 'transaction updated';
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = 'incorrect id';
  responseData.data = undefined;
  return res.json(responseData);
}
const pendingToFailed = async (req,res)=>{
  const isAdmin = await checkAdmin(req)
  if(!isAdmin){
    res.statusCode = 401;
    return res.json('Unauthorize');
  }
  const transaction = await models.transaction.findOne({
    where:{
      id:req.params.id
    }
  });
  if(transaction){
    await models.transaction.update(
      {
        status:'failed'
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    responseData.status = true;
    responseData.message = 'transaction updated';
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = 'incorrect id';
  responseData.data = undefined;
  return res.json(responseData);
}
module.exports = {
  //service 
  userNewServiceTransactions,
  failedServiceTransactions,
  successfulServiceTransactions,
  getServiceTransaction,
  getAServiceTransactionInfo,
  pendingServiceTransactions,

  userNewTransactions,
  failedTransactions,
  successfulTransactions,
  getTransaction,
  getATransactionInfo,
  pendingTransactions,

  allNewTransactions,
  allFailedTransactions,
  allSuccessfulTransactions,
  allPendingTransactions,

  //widthraw
  createTransferRecipient,
  initiateATransfer,
  validatePayment,

  //validation
  pendingToFailed,
  pendingToSuccess
}