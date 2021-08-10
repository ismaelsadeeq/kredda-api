const models = require('../models');
const uuid = require('uuid');
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

}
const saveAndChargeCreditCard = async (req,res)=>{

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
  getAllCreditCards,
  getCreditCard,
  editCreditCard,
  deleteCreditCard
}