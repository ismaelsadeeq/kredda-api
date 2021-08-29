const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const helpers = require('../utilities/helpers');
const paystackApi = require('../utilities/paystack.api');
const shagoApi = require('../utilities/shago.api');
const mobileAirtime = require('../utilities/mobile.airtime.api');
const baxiApi = require('../utilities/baxi.api');
require('dotenv').config();
//response
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
    return await shagoApi.airtimePushase(payload,res) 
  }
  if(beneficiary.gateway=="mobile airtime"){
    let trxRef = `MAIRTIME-CREDIT-CARD${digits}`
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
      network:service.code,
      reference:trxRef,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    if(transaction.message=="mtn vtu airtime purchase"){
      return await mobileAirtime.mtnVTUTopUp(payload,res);
    }
    if(transaction.message=="airtime purchase"){
      return await mobileAirtime.airtimeTopUp(payload,res);
    }
    if(transaction.message=="foreign airtime purchase"){
      payload.productId = beneficiary.product;
      payload.country = beneficiary.country;
      return await mobileAirtime.rechargeInternationalNumber(payload,res);
    }
  }
  if(beneficiary.gateway=="baxi"){
    let trxRef = `BAXI-CREDIT-CARD${digits}`
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
      type:beneficiary.type,
      plan:beneficiary.plan,
      reference:trxRef,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await baxiApi.purchaseAirtime(payload,res) 
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
    return await shagoApi.dataPurchase(payload,res) 
  }
  if(beneficiary.gateway =="mobile airtime"){
    let trxRef = `mAIRTIME-CREDIT-CARD${digits}`
    let phoneNumber = beneficiary.phoneNumber;
    let service = await models.service.findOne(
      {
        where:{
          id:beneficiary.service
        }
      }
    );
    if(transaction.message=="mtn data gifting"){
      let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
      let payload = {
        userId:transaction.userId,
        phoneNumber:phoneNumber,
        dataSize:beneficiary.dataSize,
        network:service.code,
        reference:trxRef,
        serviceId:service.id,
        totalServiceFee:transaction.amount,
        profit:profit
      }
      return await mobileAirtime.mtnDataGifting(payload,res) 
    }
    if(transaction.message=="mtn data share"){
      let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
      let payload = {
        userId:transaction.userId,
        phoneNumber:phoneNumber,
        dataSize:beneficiary.dataSize,
        network:service.code,
        reference:trxRef,
        serviceId:service.id,
        totalServiceFee:transaction.amount,
        profit:profit
      }
      return await mobileAirtime.mtnDataShare(payload,res) 
    }
    if(transaction.message=="data purchase"){
      let profit = parseFloat(transaction.amount) - parseFloat(beneficiary.amount);
      let payload = {
        userId:transaction.userId,
        phoneNumber:phoneNumber,
        network:service.code,
        reference:trxRef,
        amount:beneficiary.amount,
        serviceId:service.id,
        totalServiceFee:transaction.amount,
        profit:profit
      }
      return await mobileAirtime.dataTopUp(payload,res) 
    }
  }
  if(beneficiary.gateway=="baxi"){
    let trxRef = `BAXI-CREDIT-CARD${digits}`
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
      type:beneficiary.type,
      code:beneficiary.code,
      reference:trxRef,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await baxiApi.purchaseData(payload,res) 
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
    return await shagoApi.purchaseElectricity(payload,res) 
  }
  if(beneficiary.gateway=="mobile airtime"){
    let trxRef = `mAIRTIME-CREDIT-CARD${digits}`
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
      meterNo:beneficiary.meterNo,
      type:beneficiary.type,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await mobileAirtime.purchaseElectricity(payload,res) 
  }
  if(beneficiary.gateway=="baxi"){
    let trxRef = `BAXI-CREDIT-CARD${digits}`
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
      meterNo:beneficiary.meterNo,
      phoneNumber:beneficiary.phoneNumber,
      type:beneficiary.code,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await baxiApi.purchaseElectricity(payload,res) 
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
    return await shagoApi.waecPinPurchase(payload,res) 
  }
  if(beneficiary.gateway=="mobile airtime"){
    let trxRef = `mAIRTIME-CREDIT-CARD${digits}`;
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
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await mobileAirtime.purchaseWeacDirect(payload,res) 
  }
  if(beneficiary.gateway=="baxi"){
    let trxRef = `BAXI-CREDIT-CARD${digits}`;
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
      pinValue:beneficiary.pinValue,
      numberOfPins:beneficiary.noOfPins,
      type:beneficiary.type,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await mobileAirtime.purchaseWeacDirect(payload,res) 
  }
}
const necoPurchase = async (transaction,res)=>{
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
  if(beneficiary.gateway=="mobile airtime"){
    let trxRef = `mAIRTIME-CREDIT-CARD${digits}`;
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
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await mobileAirtime.purchaseNecoDirect(payload,res) 
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
    return await shagoApi.purchaseDstvNoAddOn(payload,res) 
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
    return await shagoApi.purchaseDstvWithAddOn(payload,res) 
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
    return await shagoApi.startimesPurchase(payload,res) 
  }
  if(beneficiary.gateway=="mobile airtime"){
    let trxRef = `mAIRTIME-CREDIT-CARD${digits}`
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
      phoneNumber:beneficiary.phoneNumber,
      cardNo:beneficiary.cardNo,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await mobileAirtime.rechargeStartimes(payload,res) 
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
      period:beneficiary.period,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }
    return await shagoApi.goTvPurchase(payload,res) 
  }
  if(beneficiary.gateway=="mobile airtime"){
    let trxRef = `mAIRTIME-CREDIT-CARD${digits}`
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
      phoneNumber:beneficiary.phoneNumber,
      cardNo:beneficiary.cardNo,
      type:beneficiary.type,
      customerName:beneficiary.customerName,
      invoiceNo:beneficiary.invoiceNo,
      customerNumber:beneficiary.customerNumber,
      serviceId:service.id,
      totalServiceFee:transaction.amount,
      profit:profit
    }

    return await mobileAirtime.rechargeGoOrDstv(payload,res) 
  }
}
const cablePurchase = async (transaction,res)=>{
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
  beneficiary.gateway=="mobile airtime"
  let trxRef = `BAXI-CREDIT-CARD${digits}`
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
    productMonthsPaidFor:beneficiary.productMonthsPaidFor,
    addonMonthsPaidFor:beneficiary.addonMonthsPaidFor,
    productCode:beneficiary.productCode,
    addOnCode:beneficiary.addOnCode,
    type:beneficiary.type,
    serviceId:service.id,
    totalServiceFee:transaction.amount,
    profit:profit
  }
  return await baxiApi.purchaseCableTv(payload,res) 
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
    return await shagoApi.jambPinPurchase(payload,res) 
  }
}

module.exports = {
  airtimePurchase,
  dataPurchase,
  dstvPurchase,
  startimesPurchase,
  goTvPurchase,
  cablePurchase,
  dstvPurchaseWithAddOn,
  jambPurchase,
  waecPurchase,
  electricityPurchase,
  necoPurchase
}