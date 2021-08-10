const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const saveCreditCard = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  if(!data){
    responseData.message = "empty post";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData)
  }
  const cardExist = await models.creditCard.findOne(
    {
      where:{
        cardNumber:data.cardNumber
      }
    }
  );
  if(cardExist){
    responseData.message = "card exist";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  }
  const createCard = await models.creditCard.create(
    {
      id:uuid.v4(),
      userId:user.id,
      authCode:null,
      cardNumber:data.cardNumber,
      cardType:data.cardType,
      lastDigits:data.lastDigits,
      // accountName:data.accountName,
      bankName:data.bankName,
      bankCode:data.bankCode,
      expiryMonth:data.expiryMonth,
      expiryYear:data.expiryYear
    }
  );
  if(!createCard){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = createCard;
  return res.json(responseData)
}
const chargeSavedCreditCard = async (req,res)=>{
  const data = req.body;
  const id = req.params.id;
  const user = req.user;
  const payment = await options.getPayment();
  const creditCard = await models.creditCard.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!creditCard){
    responseData.message = "card does not exist";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(creditCard.authCode == null){
    responseData.status = 200;
    responseData.message = "pay with widget auth code not generated";
    responseData.data = creditCard
    return res.json(responseData)
  }
  if(payment.siteName =='paystack'){
    const payload = {
      amount : data.amount,
      email : user.email,
      authorizationCode : creditCard.authCode,
      userId:user.id,
      firstName:user.firstName
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "charge initiated";
    responseData.data = creditCard
  }
  responseData.status = 200;
  responseData.message = "something went wrong";
  responseData.data = undefined
}
const saveAndChargeCreditCard = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  let reference = data.reference;
  const amount = data.amount;
  if(!data){
    responseData.message = "empty post";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData)
  }
  const cardExist = await models.creditCard.findOne(
    {
      where:{
        cardNumber:data.cardNumber
      }
    }
  );
  if(!cardExist){
    const createCard = await models.creditCard.create(
      {
        id:uuid.v4(),
        userId:user.id,
        authCode:null,
        cardType:data.cardType,
        lastDigits:data.last4,
        // accountName:data.accountName,
        bank:data.bank,
        bankName:data.bankName,
        bankCode:data.bankCode,
        expMonth:data.expMonth,
        expYear:data.expYear
      }
    );
  }
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      userId:user.id,
      message:"funding of wallet",
      reference:reference,
      beneficiary:"self",
      description:user.firstName + "funding his/her wallet to perform transaction",
      amount:amount,
      status:"initiated",
      time: new Date()
    }
  );
  responseData.status = true;
  responseData.message = "charge initiated";
  responseData.data = {
    transactionReference:trxRef
  }
  return res.json(responseData);
}
const chargeDefaultCreditCard = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const payment = options.getPayment();
  const creditCard = await models.creditCard.findOne(
    {
      where:{
        isDefault:true
      }
    }
  );
  if(!creditCard){
    responseData.message = "there is no default credit card";
    responseData.status = false;
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(!creditCard.authCode){
    responseData.status = 200;
    responseData.message = "pay with widget auth code not generated";
    responseData.data = creditCard
  }
  if(payment.siteName =='paystack'){
    const payload = {
      amount : data.amount,
      email : user.email,
      authorizationCode : creditCard.authCode,
      userId:user.id,
      firstName:user.firstName
    }
    await paystackApi.chargeAuthorization(payload,payment);
    responseData.status = 200;
    responseData.message = "charge initiated";
    responseData.data = creditCard
  }
}
const getAllCreditCards = async (req,res)=>{
  const user = req.user;
  const creditCards = await models.creditCard.findAll(
    {
      where:
      {
        userId:user.id
      }
    }
  );
  if(!creditCards){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "something went wrong";
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "Completed";
  responseData.data = creditCards;
  return res.json(responseData)
}
const getCreditCard = async (req,res)=>{
  const id = req.params.id;
  const creditCard = await models.creditCard.findOne(
    {
      where:
      {
        id:id
      }
    }
  );
  if(!creditCard){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "something went wrong";
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "Completed";
  responseData.data = creditCard;
  return res.json(responseData)
}
const editCreditCard = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const creditCard = await models.creditCard.update(
    {
      cardType:data.cardType,
      lastDigits:data.last4,
      // accountName:data.accountName,
      bank:data.bank,
      bankName:data.bankName,
      bankCode:data.bankCode,
      expMonth:data.expMonth,
      expYear:data.expYear
    },
    {
      where:
      {
        id:id
      }
    }
  );
  if(!creditCard){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "something went wrong";
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "updated";
  responseData.data = undefined;
  return res.json(responseData)
}
const changeToDefault = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const trueCreditCard = await models.creditCard.findOne(
    {
      where:
      {
        isDefault:true
      }
    }
  );
  await models.creditCard.update(
    {
      isDefault:false
    },
    {
      where:
      {
        id:trueCreditCard.id
      }
    }
  );
  const creditCard = await models.creditCard.update(
    {
      isDefault:true
    },
    {
      where:
      {
        id:id
      }
    }
  );
  if(!creditCard){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "something went wrong";
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "updated";
  responseData.data = creditCard;
  return res.json(responseData)
}
const deleteCreditCard = async (req,res)=>{
  const id = req.params.id;
  const creditCard = await models.creditCard.destroy(
    {
      where:
      {
        id:id
      }
    }
  );
  if(!creditCard){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "something went wrong";
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "card deleted";
  responseData.data = creditCard;
  return res.json(responseData)
}
const verifyTransaction = async (req,res)=>{
  const reference = req.params.reference;
  if(payment.siteName =='paystack'){
    const payload = {
      reference:reference
    }
    await paystackApi.verifyPayment(payload,payment,res);
  }
}
module.exports = {
  saveCreditCard,
  chargeSavedCreditCard,
  saveAndChargeCreditCard,
  chargeDefaultCreditCard,
  getAllCreditCards,
  getCreditCard,
  editCreditCard,
  deleteCreditCard,
  changeToDefault,
  verifyTransaction
}