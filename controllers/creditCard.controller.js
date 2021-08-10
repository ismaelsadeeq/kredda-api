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
  const cardExist = await models.creditcard.findOne(
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
  const createCard = await models.creditcard.create(
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
  if(!createCard){
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = data;
  return res.json(responseData)
}
const chargeSavedCreditCard = async (req,res)=>{
  const data = req.body;
  const id = req.params.id;
  const user = req.user;
  const payment = options.getPayment();
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
    await paystackApi.chargeAuthorization(payload,payment)
  }
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
  const cardExist = await models.creditcard.findOne(
    {
      where:{
        cardNumber:data.cardNumber
      }
    }
  );
  if(!cardExist){
    const createCard = await models.creditcard.create(
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

}
const chargeCreditCard = async (req,res)=>{

}
const getAllCreditCards = async (req,res)=>{

}
const getCreditCard = async (req,res)=>{

}
const editCreditCard = async (req,res)=>{

}
const deleteCreditCard = async (req,res)=>{

}

module.exports = {
  saveCreditCard,
  chargeSavedCreditCard,
  saveAndChargeCreditCard,
  chargeCreditCard,
  chargeDefaultCreditCard,
  getAllCreditCards,
  getCreditCard,
  editCreditCard,
  deleteCreditCard
}