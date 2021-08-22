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
const baxiPurchaseAirtime = async (req,res)=>{
  
}
const baxiGetDataBundle = async (req,res)=>{
  
}
const baxiPurchaseData = async (req,res)=>{
  
}
const baxiGetDisco = async (req,res)=>{
  
}
const baxiPurchaseElectricity = async (req,res)=>{
  
}
const baxiGetPinBundle = async (req,res)=>{
  
}
const baxiPurchasePin = async (req,res)=>{
  
}
const baxiCableLookUp = async (req,res)=>{
  
}
const baxiCableAddOnLookUp = async (req,res)=>{
  
}
const baxiVerifyTransaction = async (req,res)=>{
  
}
//mobile Airtime
const mAirtimeMtnVtuTopUp = async (req,res)=>{
  
}
const mAirtimeAirtimeTopUp = async (req,res)=>{
  
}
const mAirtimeVerifyInternationalNumber = async (req,res)=>{
  
}
const mAirtimeRechargeInternational = async (req,res)=>{
  
}
const mAirtimeMtnDataGifting = async (req,res)=>{
  
}
const mAirtimeMtnDataShare = async (req,res)=>{
  
}
const mAirtimeGetDataPricing = async (req,res)=>{
  
}
const mAirtimeDataTopUp = async (req,res)=>{
  
}
const mAirtimeGetDiscos = async (req,res)=>{
  
}
const mAirtimeMeterVerification = async (req,res)=>{
  
}
const mAirtimeElectricityPurchase = async (req,res)=>{
  
}
const mAirtimeWaecPurchase = async (req,res)=>{
  
}
const mAirtimeNecoPurchase = async (req,res)=>{
  
}
const mAirtimeGetCableInfo = async (req,res)=>{
  
}
const mAirtimeRechargeGoTv = async (req,res)=>{
  
}
const mAirtimeRechargeDstv = async (req,res)=>{
  
}
const mAirtimeRechargeStartimes = async (req,res)=>{
  
}
const mAirtimeVerifyTransaction = async (req,res)=>{
  
}

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
  shagoDataLookup,
  //mobile airtime
  mAirtimeMtnVtuTopUp,
  mAirtimeAirtimeTopUp,
  mAirtimeVerifyInternationalNumber,
  mAirtimeRechargeInternational,
  mAirtimeMtnDataGifting,
  mAirtimeMtnDataShare,
  mAirtimeGetDataPricing,
  mAirtimeDataTopUp,
  mAirtimeGetDiscos,
  mAirtimeMeterVerification,
  mAirtimeElectricityPurchase,
  mAirtimeWaecPurchase,
  mAirtimeNecoPurchase,
  mAirtimeGetCableInfo,
  mAirtimeRechargeGoTv,
  mAirtimeRechargeDstv,
  mAirtimeRechargeStartimes,
  mAirtimeVerifyTransaction,
  //Baxi
  baxiPurchaseAirtime,
  baxiGetDataBundle,
  baxiPurchaseData,
  baxiGetDisco,
  baxiPurchaseElectricity,
  baxiGetPinBundle,
  baxiPurchasePin,
  baxiCableLookUp,
  baxiCableAddOnLookUp,
  baxiVerifyTransaction
}