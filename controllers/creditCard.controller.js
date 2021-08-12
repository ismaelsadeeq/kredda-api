const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
const flutterwaveApi = require('../utilities/flutterwave.api');
const helpers = require('../utilities/helpers')
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
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
  if(payment.siteName =='paystack'){
    if(creditCard.authCode == null){
      responseData.status = 200;
      responseData.message = "pay with widget auth code not generated";
      responseData.data = creditCard;
      return res.json(responseData)
    }
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
  if(payment.siteName =='flutterwave'){
    responseData.status = 200;
    responseData.message = "pay with widget";
    responseData.data = creditCard;
    return res.json(responseData);
  }
  responseData.status = 200;
  responseData.message = "something went wrong";
  responseData.data = undefined
}
const initiateCardChargePaystack = async (req,res)=>{
  const reference = req.params.reference;
  const user = req.user;
  const amount = data.amount;
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      userId:user.id,
      message:"funding of wallet",
      reference:reference,
      beneficiary:"self",
      description:user.firstName + " funding his/her wallet to perform transaction",
      amount:amount,
      isRedemmed:false,
      status:"initiated",
      time: new Date()
    }
  );
  responseData.status = true;
  responseData.message = "charge initiated";
  responseData.data = {
    transactionReference:reference
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
  if(payment.siteName =='paystack'){
    if(!creditCard.authCode){
      responseData.status = true;
      responseData.message = "pay with widget";
      responseData.data = {
        transactionReference:trxRef
      }
      return res.json(responseData);
    }
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
      accountName:data.accountName,
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
  const user = req.user;
  if(payment.siteName =='paystack'){
    const payload = {
      reference:reference
    }
    await paystackApi.verifyPayment(payload,payment,res);
  }
  if(payment.siteName =='flutterwave'){
    const payload = {
      reference:reference,
      userId:user.id,
      firstName:user.firstName,
      id:req.body.id
    }
    await flutterwaveApi.verifyPayment(payload,payment,res);
  }

}
module.exports = {
  chargeSavedCreditCard,
  chargeDefaultCreditCard,
  getAllCreditCards,
  getCreditCard,
  editCreditCard,
  deleteCreditCard,
  changeToDefault,
  verifyTransaction,
  initiateCardChargePaystack
}