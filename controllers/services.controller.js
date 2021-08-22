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
//Shago
const shagoBuyAirtime = async (req,res)=>{
  
}
const shagoDataLookup = async (req,res)=>{
  
}
const shagoDataPurchase = async (req,res)=>{

}
const shagoMeterVerification = async (req,res)=>{
  
}
const shagoPurchaseElectricity = async (req,res)=>{
  
}
const shagoWaecPinLookup = async (req,res)=>{
  
}
const shagoWaecPinPurchase = async (req,res)=>{
  
}
const shagoJambLookUp = async (req,res)=>{
  
}
const shagoJambVerification = async (req,res)=>{
  
}
const shagoJambPurchase = async (req,res)=>{
  
}
const shagoCableLookup = async (req,res)=>{
  
}
const shagoCableBouquoteLookup = async (req,res)=>{
  
}
const shagoGetDstvAddOn = async (req,res)=>{
  
}
const shagoPurchaseDstv = async (req,res)=>{
  
}
const shagoPurchaseDstvWithAddOn = async (req,res)=>{
  
}
const shagoPurchaseStartimes = async (req,res)=>{
  
}
const shagoPurchaseGoTv = async (req,res)=>{
  
}
const shagoVerifyTransaction = async (req,res)=>{
  
}
//Baxi

//mobile Airtime


module.exports = {
  shagoBuyAirtime,
  shagoVerifyTransaction,
  shagoPurchaseGoTv,
  shagoPurchaseStartimes,
  shagoPurchaseDstvWithAddOn,
  shagoPurchaseDstv,
  shagoGetDstvAddOn,
  shagoCableBouquoteLookup,
  shagoCableLookup,
  shagoJambPurchase,
  shagoJambVerification,
  shagoJambLookUp,
  shagoWaecPinPurchase,
  shagoWaecPinLookup,
  shagoPurchaseElectricity,
  shagoMeterVerification,
  shagoDataPurchase,
  shagoDataLookup
}