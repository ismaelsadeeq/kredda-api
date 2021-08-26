const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const helpers = require('../utilities/helpers');
const paystackApi = require('../utilities/paystack.api');
const shagoApi = require('../utilities/shago.api');
let crypto = require('crypto');
var request = require('request');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const apiKey = process.env.FREECONVERTER
async function getSecret(){
  const payment = await options.getPayment();
  let privateKey;
  if(payment.privateKey){
    privateKey = payment.privateKey;
  }else{
    privateKey = payment.testPrivateKey
  }
  return privateKey;
}

const airtimePurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let phoneNumber = beneficiary.phoneNumber;
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      phoneNumber:phoneNumber,
      amount:beneficiary.amount,
      network:service.name,
      reference:trxRef,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    await shagoApi.airtimePushase(payload,res) 
  }
}
const dataPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let phoneNumber = beneficiary.phoneNumber;
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      phoneNumber:phoneNumber,
      amount:beneficiary.amount,
      network:service.name,
      reference:trxRef,
      bundle:beneficiary.bundle,
      package:beneficiary.package,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    await shagoApi.dataPurchase(payload,res) 
  }
}
const electricityPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let phoneNumber = beneficiary.phoneNumber;
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      phoneNumber:phoneNumber,
      amount:beneficiary.amount,
      reference:trxRef,
      meterNo:beneficiary.meterNo,
      disco:beneficiary.disco,
      type:beneficiary.type,
      name:beneficiary.name,
      address:beneficiary.address,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    await shagoApi.purchaseElectricity(payload,res) 
  }
}
const waecPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`;
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      amount:beneficiary.amount,
      reference:trxRef,
      numberOfPin:beneficiary.numberOfPin,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    console.log(payload);
    await shagoApi.waecPinPurchase(payload,res) 
  }
}
const dstvPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      amount:beneficiary.amount,
      reference:trxRef,
      cardNo:beneficiary.cardNo,
      customerName:beneficiary.customerName,
      packageName:beneficiary.packageName,
      packageCode:beneficiary.packageCode,
      period:beneficiary.period,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    console.log(payload);
    await shagoApi.purchaseDstvNoAddOn(payload,res) 
  }
}
const dstvPurchaseWithAddOn = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      amount:beneficiary.amount,
      reference:trxRef,
      cardNo:beneficiary.cardNo,
      customerName:beneficiary.customerName,
      packageName:beneficiary.packageName,
      packageCode:beneficiary.packageCode,
      period:beneficiary.period,
      addOnCode:beneficiary.addOnCode,
      addOnProductName:beneficiary.addOnProductName,
      addOnAmount:beneficiary.addOnAmount,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    console.log(payload);
    await shagoApi.purchaseDstvWithAddOn(payload,res) 
  }
}
const startimesPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      amount:beneficiary.amount,
      reference:trxRef,
      cardNo:beneficiary.cardNo,
      customerName:beneficiary.customerName,
      packageName:beneficiary.packageName,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    console.log(payload);
    await shagoApi.startimesPurchase(payload,res) 
  }
}
const goTvPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      amount:beneficiary.amount,
      reference:trxRef,
      cardNo:beneficiary.cardNo,
      customerName:beneficiary.customerName,
      packageName:beneficiary.packageName,
      packageCode:beneficiary.packageCode,
      period:data.period,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    console.log(payload);
    await shagoApi.startimesPurchase(payload,res) 
  }
}
const jambPurchase = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful",
      isRedemmed:true,
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let digits = helpers.generateOTP()
  let beneficiary = JSON.parse(transaction.beneficiary);
  if(beneficiary.gateway=="shago"){
    let trxRef = `SHAGO-CREDIT-CARD${digits}`
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
    let payload = {
      userId:transaction.userId,
      amount:beneficiary.amount,
      reference:trxRef,
      type:beneficiary.type,
      profileCode:beneficiary.profileCode,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    console.log(payload);
    await shagoApi.jambPinPurchase(payload,res) 
  }
}

module.exports = {
  airtimePurchase,
  dataPurchase,
  dstvPurchase,
  startimesPurchase,
  goTvPurchase,
  dstvPurchaseWithAddOn,
  jambPurchase,
  waecPurchase,
  electricityPurchase
}