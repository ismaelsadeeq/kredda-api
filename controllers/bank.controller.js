const models = require('../models');
const uuid = require('uuid');
const helpers = require('../utilities/helpers')
const { getPayment } = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
const flutterwaveApi = require('../utilities/flutterwave.api');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createBankDetail = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const bankDetail = await models.bank.findOne(
    {
      where:{
        userId:user.id,
        bankName:data.bankName,
      }
    }
  );
  if(bankDetail){
    responseData.status = true;
    responseData.message = "account already exist";
    responseData.data = data;
    return res.json(responseData);
  }
  if(!bankDetail){
    await models.bank.create(
      {
        id:uuid.v4(),
        userId:user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        bankName:data.bankName,
        bankCode:data.bankCode,
        accountNumber:data.accountNumber,
        kudaToken:data.kudaToken
      }
    );
    if(payment.siteName =='paystack'){
      let payload = {
        name:`${data.firstName || user.firstName} ${data.lastName || user.lastName}`,
        accountNumber:data.accountNumber,
        bankCode:data.bankCode
      } 
      return await paystackApi.verifyAccountNumber(payment,payload,req.user.id,res)
    }
    if(payment.siteName =='flutterwave'){
      let payload = {
        accountNumber:data.accountNumber,
        bankCode:data.bankCode
      }
      return await flutterwaveApi.validateAccount(payload,payment,res)
    }
    if(payment.siteName =='monnify'){
      responseData.status = true;
      responseData.message = "account payment not supported on this gateway";
      responseData.data = data;
      return res.json(responseData);
    }
  }
  responseData.status = true;
  responseData.message = "something went wrong";
  responseData.data = data;
  return res.json(responseData);
}
const updateBankDetail = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const bankDetail = await models.bank.findOne(
    {
      where:{
        id:req.params.id,
        userId:user.id
      }
    }
  );
  if(!bankDetail){
    responseData.status = true;
    responseData.message = "bank detail does not exist";
    responseData.data = data;
    return res.json(responseData);
  }
  if(!bankDetail.isAccountValid){
    await models.bank.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        userId:user.id,
        bankCode:data.bankCode,
        accountNumber:data.accountNumber,
        kudaToken:data.kudaToken
      },
      {
        where:{
          userId:user.id,
          bankName:data.bankName,
        }
      }
    );
    if(payment.siteName =='paystack'){
      let name  = data.firstName + " "+ data.lastName;
      let payload = {
        name:`${data.firstName || user.firstName} ${data.lastName || user.lastName}`,
        accountNumber:data.accountNumber,
        bankCode:data.bankCode
      }
      return await paystackApi.verifyAccountNumber(payment,payload,req.user.id,res);
    }
    if(payment.siteName =='flutterwave'){
      let payload = {
        accountNumber:data.accountNumber,
        bankCode:data.bankCode
      }
      return await flutterwaveApi.validateAccount(payload,payment,res)
    }
    if(payment.siteName =='monnify'){
      responseData.status = true;
      responseData.message = "account payment not supported on this gateway";
      responseData.data = data;
      return res.json(responseData);
    }
  } else {
    responseData.status = true;
    responseData.message = "account is valid";
    responseData.data = data;
    return res.json(responseData);
  }
}
const getBankDetails = async (req,res)=>{
  const user = req.user;
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const banksDetails = await models.bank.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  responseData.data = banksDetails;
  responseData.message = "successful";
  responseData.status = true;
  return res.json(responseData);
}
const getBankDetail = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const banksDetail = await models.bank.findOne(
    {
      where:{
        id:req.params.id
      }
    }
  );
  responseData.data = banksDetail;
  responseData.message = "successful";
  responseData.status = true;
  return res.json(responseData);
}
const deleteBankDetail = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const banksDetail = await models.bank.destroy(
    {
      where:{
        id:req.params.id
      }
    }
  );
  responseData.data = banksDetail;
  responseData.message = "bank detail deleted";
  responseData.status = true;
  return res.json(responseData);
}
const fundAccount = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const id = req.params.id;
  const payment = await getPayment();
  const bankDetail = await models.bank.findOne(
    {
      id:id
    }
  );
  if(!bankDetail){
    responseData.data = undefined;
    responseData.message = "bank does not exist";
    responseData.status = false;
    return res.json(responseData);
  }
  if(!bankDetail.isAccountValid){
    responseData.data = undefined;
    responseData.message = "bank is not validated";
    responseData.status = false;
  }
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(payment.siteName =='paystack'){
    if(bankDetail.bankName=="kuda Bank"){
      const payload = {
        "email":user.email,
        "id":user.id,
        "amount":parseInt(data.amount * 100),
        "value":"Kredda",
        "displayName":user.firstName,
        "variableName":"virtual wallet funding",
        "bankCode":bankDetail.bankCode,
        "token":bankDetail.kudaToken
      }
      return await paystackApi.createChargeKuda(payload,res)
    }
    const payload = {
      "email":user.email,
      "id":user.id,
      "amount":parseInt(data.amount),
      "value":"Kredda",
      "displayName":user.firstName,
      "variableName":"virtual wallet funding",
      "bankCode":bankDetail.bankCode,
      "accountNumber":bankDetail.accountNumber,
      "birthday":user.birthday
    }
    return await paystackApi.createCharge(payment,payload,res)
  }
  if(payment.siteName =='flutterwave'){
    let digits = helpers.generateOTP()
    let name = user.firstName;
    let firstDigit = name.substring(0,1);
    let trxRef = `MC-${digits}${firstDigit}`
    const payload = {
      "tx_ref":trxRef,
      "amount":parseInt(data.amount),
      "account_bank":bankDetail.bankCode,
      "account_number":bankDetail.accountNumber,
      "currency":"NGN",
      "email":user.email,
      "phone_number":user.phoneNumber,
      "fullname":user.firstName + " "+ user.lastName
    }
    return await flutterwaveApi.initiatePayment(user.id,payload,payment,res);
  }
  if(payment.siteName =='monnify'){
    responseData.status = 200;
    responseData.message = "pay with widget";
    responseData.data = creditCard;
    return res.json(responseData);
  }
}
const validateChargeFlutterwave = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment();
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!data.card){
    const payload = {
      "otp":data.otp,
      "flw_ref":data.reference,
      "type": "account"
    }
    return await flutterwaveApi.validateCharge(payload,payment,res)
  }
  const payload = {
    "otp":data.otp,
    "flw_ref":flw_ref,
    "type": "card"
  }
  return await flutterwaveApi.validateCharge(payload,payment,res)
  
}
const verifyPaymentWithPin = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    "pin":data.pin,
    "reference":data.reference
  }
  return await paystackApi.submitPin(payment,payload,res)
}
const verifyPaymentWithOtp = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    "otp":data.otp,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitOtp(payment,payload,res)
  
}
const verifyPaymentWithBirthday = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    "birthday":data.birthday,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitBirthday(payment,payload,res)
  
}
const verifyPaymentWithPhoneNumber = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    "phone":data.phone,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitPhone(payment,payload,res)
  
}
const verifyPaymentWithAddress = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    "address":data.address,
    "city":data.city,
    "state":data.state,
    "zip_code":data.zipCode,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitAddress(payment,payload,res)
}

const checkChargeStatus = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.checkPendingCharge(payment,payload,res);
}
const checkChargeStatusFlutterwave = async (req,res)=>{
  const reference = req.params.reference;
  const user = req.user;
  const payment = await getPayment()
  if(!payment){
    responseData.status = 200;
    responseData.status = true
    responseData.message = "payment getway not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    reference:reference,
    userId:user.id,
    firstName:user.firstName,
    id:req.body.id
  }
  await flutterwaveApi.verifyPayment(payload,payment,res);
}
const adminGetFunds = async(req,res)=>{
  const id = req.user.id;
  const userId = req.params.id;
  const admin = await models.admin.findOne({
    where:{
      id:id
    }
  });
  if(!admin){
    res.statusCode = 401;
    return res.json('Unauthorize');
  }
  const getBankDetail = await models.bank.findAll({
    where:{
      userId:userId
    }
  });

  const wallet = await models.wallet.findOne({
    where:{
      userId:userId
    }
  })
  const otherAccounts = await models.otherAccount.findAll({
    where:{
      userId:userId
    }
  });

  const saving = await models.saving.findOne({
    where:{
      userId:userId
    }
  });
  responseData.status = 200;
  responseData.status = true
  responseData.message = "completed";
  responseData.data = {getBankDetail,wallet,otherAccounts,saving};
  return res.json(responseData);
   
}
module.exports = {
  verifyPaymentWithPin,
  verifyPaymentWithOtp,
  verifyPaymentWithBirthday,
  verifyPaymentWithPhoneNumber,
  verifyPaymentWithAddress,
  checkChargeStatus,
  createBankDetail,
  getBankDetails,
  updateBankDetail,
  getBankDetail,
  deleteBankDetail,
  fundAccount,
  checkChargeStatusFlutterwave,
  validateChargeFlutterwave,
  adminGetFunds
}