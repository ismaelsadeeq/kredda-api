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
  const bankDetail = await models.bankDetail.findOne(
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
    await models.bankDetail.create(
      {
        id:uuid.v4(),
        userId:user.id,
        bankName:data.bankName,
        bankCode:data.bankCode,
        accountNumber:data.accountNumber,
        kudaToken:data.kudaToken
      }
    );
    let payload = {
      name:user.firstName + ' '+user.lastName,
      accountNumber:data.accountNumber,
      bankCode:data.bankCode
    }
    return await paystackApi.verifyAccountNumber(payload,req.user.id,res)
  }
}
const updateBankDetail = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const bankDetail = await models.bankDetail.findOne(
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
    await models.bankDetail.update(
      {
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
    let name  = data.firstName + " "+ data.lastName;
    let payload = {
      name: name || user.firstName + ' '+user.lastName,
      accountNumber:data.accountNumber,
      bankCode:data.bankCode
    }
    return await paystackApi.verifyAccountNumber(payload,req.user.id,res)
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
        "amount":parseFloat(data.amount * 100),
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
      "amount":parseFloat(data.amount * 100),
      "value":"Kredda",
      "displayName":user.firstName,
      "variableName":"virtual wallet funding",
      "bankCode":bankDetail.bankCode,
      "accountNumber":bankDetail.accountNumber,
      "birthday":user.birthday
    }
    return await paystackApi.createCharge(payload,res)
  }
  if(payment.siteName =='flutterwave'){
    let digits = helpers.generateFourDigitOTP();
    let name = user.firstName;
    let firstDigit = name.substring(0,1);
    let trxRef = `MC-${digits}${firstDigit}`
    const payload = {
      "tx_ref":trxRef,
      "amount":data.amount,
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
  if(!data.card){
    const payload = {
      "otp":data.otp,
      "flw_ref":data.reference,
      "type": "account"
    }
    return await flutterwaveApi.validateCharge(payload,res)
  }
  const payload = {
    "otp":data.otp,
    "flw_ref":flw_ref,
    "type": "card"
  }
  return await flutterwaveApi.validateCharge(payload,res)
  
}
const verifyPaymentWithPin = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payload = {
    "pin":data.pin,
    "reference":data.reference
  }
  return await paystackApi.submitPin(payload,res)
}
const verifyPaymentWithOtp = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payload = {
    "otp":data.otp,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitOtp(payload,res)
  
}
const verifyPaymentWithBirthday = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payload = {
    "birthday":data.birthday,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitAddress(payload,res)
  
}
const verifyPaymentWithPhoneNumber = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payload = {
    "phone":data.phone,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitPhone(payload,res)
  
}
const verifyPaymentWithAddress = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payload = {
    "address":data.address,
    "city":data.city,
    "state":data.state,
    "zip_code":data.zipCode,
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.submitAddress(payload,res)
}

const checkChargeStatus = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const payload = {
    "reference":data.reference,
    "user":user
  }
  return await paystackApi.checkPendingCharge(payload,res);
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
  validateChargeFlutterwave
}