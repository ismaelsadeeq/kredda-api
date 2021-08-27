const models = require('../models');
const multer = require('multer');
const uuid = require('uuid');
const helpers = require('../utilities/helpers');
const multerConfig = require('../config/multer');
const shagoApi = require('../utilities/shago.api');
const mAirtimeApi = require('../utilities/mobile.airtime.api');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
const shagoHelpers = require('./services.shago.helpers');
const mAirtimeHelpers = require('./services.mairtime.helpers.controller');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
//Shago

const shagoBuyAirtime = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    console.log(data.phoneNumber)
    return await shagoHelpers.walletpayment(user,trxRef,time,service,data.phoneNumber,data.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      gateway:"shago",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"airtime purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await shagoHelpers.walletpayment(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }
  if(payment.siteName =='monnify'){
    return await shagoHelpers.walletpayment(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }

}
const shagoDataLookup = async (req,res)=>{
  const data = req.body;
  const serviceId = req.params.serviceId;
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.phoneNumber){
    let payload = {
      phoneNumber:data.phoneNumber,
      network:service.name
    }
    return await shagoApi.dataLookup(payload,res)
  }
  responseData.status = false;
  responseData.message = "phoneNumber is required";
  responseData.data = undefined;
  return res.json(responseData);
}
const shagoDataPurchase = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const serviceId = req.params.serviceId;
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  console.log(data)
  if(!data.phoneNumber || !data.amount || !data.allowance || !data.code){
    responseData.status = false;
    responseData.message = "data not complete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){ 
    return shagoHelpers.walletDatapayment(user,trxRef,time,service,data.phoneNumber,data.code,data.allowance,res)
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      gateway:"shago",
      amount:amount,
      package:data.code,
      bundle:data.allowance,
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"data purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return shagoHelpers.walletDatapayment(user,trxRef,time,service,data.phoneNumber,data.code,data.allowance,res)
  }
  if(payment.siteName =='monnify'){
    return shagoHelpers.walletDatapayment(user,trxRef,time,service,data.phoneNumber,data.code,data.allowance,res)
  }
}
const shagoMeterVerification = async (req,res)=>{
  const data = req.body;
  const serviceId = req.params.serviceId;
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.disco && data.meterNo && data.type){
    let payload = {
      disco:data.disco,
      meterNo:data.meterNo,
      network:service.name,
      type:data.type
    }
    return await shagoApi.electricityMeterVerication(payload,res)
  }
  responseData.status = false;
  responseData.message = "data not complete";
  responseData.data = undefined;
  return res.json(responseData);
}
const shagoPurchaseElectricity = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.disco ||!data.type || !data.amount || !data.name || !data.address || !data.meterNo){
    responseData.status = false;
    responseData.message = "data incomple";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.walletElectricityPayment(user,trxRef,time,service,data.phoneNumber,data.meterNo,data.disco,data.type,data.name,data.address,data.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      meterNo:data.meterNo,
      disco:data.disco,
      type:data.type,
      name:data.name,
      address:data.address,
      gateway:"shago",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"electricity purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
     return await shagoHelpers.walletElectricityPayment(user,trxRef,time,service,data.phoneNumber,data.meterNo,data.disco,data.type,data.name,data.address,data.amount,res);
  }
  if(payment.siteName =='monnify'){
     return await shagoHelpers.walletElectricityPayment(user,trxRef,time,service,data.phoneNumber,data.meterNo,data.disco,data.type,data.name,data.address,data.amount,res);
  }
}
const shagoWaecPinLookup = async (req,res)=>{
  return await shagoApi.waecPinLookup(res);
}
const shagoWaecPinPurchase = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.numberOfPin || !data.amount){
    responseData.status = false;
    responseData.message = "data incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.waecPinPurchase(user,trxRef,time,service,data.amount,data.numberOfPin,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      numberOfPin:data.numberOfPin,
      gateway:"shago",
      service:serviceId,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"waec pin purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
     return await shagoHelpers.waecPinPurchase(user,trxRef,time,service,data.amount,data.numberOfPin,res);
  }
  if(payment.siteName =='monnify'){
     return await shagoHelpers.waecPinPurchase(user,trxRef,time,service,data.amount,data.numberOfPin,res);
  }
}
const shagoJambLookUp = async (req,res)=>{
  return shagoApi.jambLookup(res);  
}
const shagoJambVerification = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  if(data.type && data.profileCode){
    return shagoApi.jambProfileVerificaion(data,res);
  }
  res.statusCode = 200;
  responseData.message = "data is incomplete";
  responseData.status = false;
  responseData.data = data;
  return res.json(responseData)
}
const shagoJambPurchase = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.type || !data.amount || !data.profileCode){
    responseData.status = false;
    responseData.message = "data incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.jambPinPurchase(user,trxRef,time,service,data.type,data.amount,data.profileCode,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      type:data.type,
      profileCode:data.profileCode,
      gateway:"shago",
      service:serviceId,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"jamb pin purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await shagoHelpers.jambPinPurchase(user,trxRef,time,service,data.type,data.amount,data.profileCode,res);
  }
  if(payment.siteName =='monnify'){
    return await shagoHelpers.jambPinPurchase(user,trxRef,time,service,data.type,data.amount,data.profileCode,res);
  }
}
const shagoCableLookup = async (req,res)=>{
  const data = req.body;
  if(data.smartCard && data.type){
     return await shagoApi.cableLookup(data,res);
  }
  res.statusCode = 200;
  responseData.message = "data is incomplete";
  responseData.status = false;
  responseData.data = data;
  return res.json(responseData)
}
const shagoCableBouquoteLookup = async (req,res)=>{
  const data = req.body;
  if(data.type){
     return await shagoApi.cableTvBouquteLookup(data,res);
  }
  res.statusCode = 200;
  responseData.message = "data is incomplete";
  responseData.status = false;
  responseData.data = data;
  return res.json(responseData)
}
const shagoGetDstvAddOn = async (req,res)=>{
  return await shagoApi.getDstvAddOns(res);
}
const shagoPurchaseDstv = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.amount || !data.cardNo || !data.customerName || !data.packageName || !data.packageCode || !data.period){
    responseData.status = false;
    responseData.message = "data incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.dstvPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      cardNo:data.cardNo,
      customerName:data.customerName,
      packageName:data.packageName,
      packageCode:data.packageCode,
      period:data.period,
      gateway:"shago",
      service:serviceId,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"dstv subscription",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await shagoHelpers.dstvPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,res);
  }
  if(payment.siteName =='monnify'){
    return await shagoHelpers.dstvPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,res);
  }
}
const shagoPurchaseDstvWithAddOn = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.amount || !data.cardNo || !data.customerName || !data.packageName || !data.packageCode || !data.period || !data.addOnCode || !data.addOnProductName || !data.addOnAmount){
    responseData.status = false;
    responseData.message = "data incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.dstvPurchaseWithAddOn(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,data.addOnCode,data.addOnProductName,data.addOnAmount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      cardNo:data.cardNo,
      customerName:data.customerName,
      packageName:data.packageName,
      packageCode:data.packageCode,
      period:data.period,
      addOnCode:data.addOnCode,
      addOnProductName:data.addOnProductName,
      addOnAmount:data.addOnAmount,
      gateway:"shago",
      service:serviceId,
    }
    beneficiary = JSON.stringify(beneficiary);
    console.log(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"dstv subscription with add on",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await shagoHelpers.dstvPurchaseWithAddOn(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,data.addOnCode,data.addOnProductName,data.addOnAmount,res);
  }
  if(payment.siteName =='monnify'){
    return await shagoHelpers.dstvPurchaseWithAddOn(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,data.addOnCode,data.addOnProductName,data.addOnAmount,res);
  }
}
const shagoPurchaseStartimes = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.amount || !data.cardNo || !data.customerName || !data.packageName){
    responseData.status = false;
    responseData.message = "data incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.startimesPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      cardNo:data.cardNo,
      customerName:data.customerName,
      packageName:data.packageName,
      gateway:"shago",
      service:serviceId,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"startimes subscription",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await shagoHelpers.startimesPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,res);
  }
  if(payment.siteName =='monnify'){
    return await shagoHelpers.startimesPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,res);
  }
}
const shagoPurchaseGoTv = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `SHAGO-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.amount || !data.cardNo || !data.customerName || !data.packageName || !data.packageCode || !data.period){
    responseData.status = false;
    responseData.message = "data incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await shagoHelpers.goTvPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      cardNo:data.cardNo,
      customerName:data.customerName,
      packageName:data.packageName,
      packageCode:data.packageCode,
      period:data.period,
      gateway:"shago",
      service:serviceId,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"goTv subscription",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await shagoHelpers.goTvPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,res);
  }
  if(payment.siteName =='monnify'){
    return await shagoHelpers.goTvPurchase(user,trxRef,time,service,data.amount,data.cardNo,data.customerName,data.packageName,data.packageCode,data.period,res);
  }
}
const shagoVerifyTransaction = async (req,res)=>{
  const reference = req.params.reference;
  if(reference){
    let payload = {
      reference:reference
    }
    return shagoApi.queryTransaction(payload,res);
  }
  responseData.status = 200;
  responseData.message = "transaction reference is required";
  responseData.data = undefined
  return res.json(responseData);
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
const baxiPurchaseCable = async (req,res)=>{

}
const baxiVerifyTransaction = async (req,res)=>{
  
}
//mobile Airtime
const mAirtimeMtnVtuTopUp = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    console.log(data.phoneNumber)
    return await mAirtimeHelpers.mtnVTUTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"mtn vtu airtime purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await mAirtimeHelpers.mtnVTUTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }
  if(payment.siteName =='monnify'){
    return await mAirtimeHelpers.mtnVTUTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }
}
const mAirtimeAirtimeTopUp = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let trxRef = helpers.generateOTP()

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.airtimePurchase(user,trxRef,time,service,data.phoneNumber,data.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"airtime purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await mAirtimeHelpers.mtnVTUTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }
  if(payment.siteName =='monnify'){
    return await mAirtimeHelpers.mtnVTUTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }
}
const mAirtimeVerifyInternationalNumber = async (req,res)=>{
  const data = req.body;
  if(data.phoneNumber && data.country){
    return await mAirtimeApi.verifyInternationalNumber(data,res);
  }
  responseData.status = 200;
  responseData.message = "data is incomplete";
  responseData.data = undefined
  return res.json(responseData);
}
const mAirtimeRechargeInternational = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount || !data.product || !data.country){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.foreignAirtimePurchase(user,trxRef,time,service,data.phoneNumber,data.amount,data.amountInNaira,data.product,data.country,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(data.amountInNaira) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      product:data.product,
      amount:amount,
      country:data.country,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"foreign airtime purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await mAirtimeHelpers.foreignAirtimePurchase(user,trxRef,time,service,data.phoneNumber,data.amount,data.amountInNaira,data.product,data.country,res)
  }
  if(payment.siteName =='monnify'){
    return await mAirtimeHelpers.foreignAirtimePurchase(user,trxRef,time,service,data.phoneNumber,data.amount,data.amountInNaira,data.product,data.country,res)
  }
}
const mAirtimeMtnDataGifting = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount || !data.size ){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.mtnDataGifting(user,trxRef,time,service,data.phoneNumber,data.amount,data.size,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      dataSize:data.size
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"mtn data gifting",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
     return await mAirtimeHelpers.mtnDataGifting(user,trxRef,time,service,data.phoneNumber,data.amount,data.size,res);
  }
  if(payment.siteName =='monnify'){
     return await mAirtimeHelpers.mtnDataGifting(user,trxRef,time,service,data.phoneNumber,data.amount,data.size,res);
  }
}
const mAirtimeMtnDataShare = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount || !data.size ){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.mtnDataShare(user,trxRef,time,service,data.phoneNumber,data.amount,data.size,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      dataSize:data.size
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"mtn data share",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
     return await mAirtimeHelpers.mtnDataShare(user,trxRef,time,service,data.phoneNumber,data.amount,data.size,res);
  }
  if(payment.siteName =='monnify'){
     return await mAirtimeHelpers.mtnDataShare(user,trxRef,time,service,data.phoneNumber,data.amount,data.size,res);
  }
}
const mAirtimeGetDataPricing = async (req,res)=>{
  const serviceId = req.params.serviceId
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    esponseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const payload = {
    network:service.code
  }
  return await mAirtimeApi.getDataPricing(payload,res);
}
const mAirtimeDataTopUp = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.phoneNumber || !data.amount ){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.dataTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"data purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
     return await mAirtimeHelpers.dataTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res);
  }
  if(payment.siteName =='monnify'){
     return await mAirtimeHelpers.dataTopUp(user,trxRef,time,service,data.phoneNumber,data.amount,res);
  }
}
const mAirtimeGetDiscos = async (req,res)=>{
  return mAirtimeApi.electricityDiscoLookup(res);
}
const mAirtimeMeterVerification = async (req,res)=>{
  const data = req.body 
  if(data.serviceId && data.meterNo){
    return await mAirtimeApi.electricityMeterVerication(data,res);
  }
  responseData.status = false;
  responseData.message = "data is incomplete";
  responseData.data = undefined;
  return res.json(responseData);
}
const mAirtimeElectricityPurchase = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  if(!data.serviceId || !data.amount || data.type){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.purchaseElectricity(user,trxRef,time,service,data.amount,serviceId,data.meterNo,data.type,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = data.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      meterNo:data.meterNo,
      type:data.type,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"electricity purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
      return await mAirtimeHelpers.purchaseElectricity(user,trxRef,time,service,data.amount,serviceId,data.meterNo,data.type,res);
  }
  if(payment.siteName =='monnify'){
      return await mAirtimeHelpers.purchaseElectricity(user,trxRef,time,service,data.amount,serviceId,data.meterNo,data.type,res);
  }
}
const mAirtimeWaecPurchase = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.waecPinPurchase(user,trxRef,time,service,service.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = service.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"waec pin purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
      return await mAirtimeHelpers.waecPinPurchase(user,trxRef,time,service,service.amount,res);
  }
  if(payment.siteName =='monnify'){
      return await mAirtimeHelpers.waecPinPurchase(user,trxRef,time,service,service.amount,res);
  }
}
const mAirtimeNecoPurchase = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`

  let time = new Date();
  time = time.toLocaleString();
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.necoPinPurchase(user,trxRef,time,service,service.amount,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = service.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"neco pin purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
      return await mAirtimeHelpers.necoPinPurchase(user,trxRef,time,service,service.amount,res);
  }
  if(payment.siteName =='monnify'){
      return await mAirtimeHelpers.necoPinPurchase(user,trxRef,time,service,service.amount,res);
  }
}
const mAirtimeGetCableInfo = async (req,res)=>{
  const data = req.body;
  const serviceId = req.params.id;
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!data.cardNo){
    responseData.status = false;
    responseData.message = "card number is required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  data.type = service.name;
  return await mAirtimeApi.getCableCustomerInfo(data,res);
}
const mAirtimeRechargeGoTv = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const serviceId = req.params.serviceId

  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `mAIRTIME-${digits}${firstDigit}`
  if(!data.phoneNumber || !data.amount || !data.cardNo || !data.customerName || !data.invoiceNo || !data.customerNumber){
    responseData.status = false;
    responseData.message = "data is incomplete";
    responseData.data = undefined;
    return res.json(responseData);
  }
  let time = new Date();
  time = time.toLocaleString();
  const service = await models.service.findOne(
    {
      where:{
        id:serviceId
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await mAirtimeHelpers.goTvRecharge(user,trxRef,time,service,service.amount,data.cardNo,data.customerName,data.invoiceNo,data.customerNumber,res);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  if(useDefault){
    creditCard = await models.creditCard.findOne(
      {
        where:{
          isDefault:true
        }
      }
    );
  } else {
    creditCard = await models.creditCard.findOne(
      {
        where:{
          id:creditCardId
        }
      }
    )
  }
  if(payment.siteName =='paystack'){
    const serviceCategory = await models.serviceCategory.findOne(
      {
        where:{
          id:service.serviceCategoryId
        }
      }
    );
    let serviceCharge = serviceCategory.serviceCharge;
    let discount = service.discount;
    let amount = service.amount;
    let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
    if(discount){
      totalAmount = totalAmount  - discount;
    }
    let beneficiary = {
      amount:amount,
      cardNo:data.cardNo,
      customerName:data.customerName,
      invoiceNo:data.invoiceNo,
      customerNumber:data.customerNumber,
      gateway:"mobile airtime",
      service:serviceId,
      phoneNumber:data.phoneNumber
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:totalAmount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"go tv purchase",
      beneficiary:beneficiary
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await mAirtimeHelpers.goTvRecharge(user,trxRef,time,service,service.amount,data.cardNo,data.customerName,data.invoiceNo,data.customerNumber,res);
  }
  if(payment.siteName =='monnify'){
    return await mAirtimeHelpers.goTvRecharge(user,trxRef,time,service,service.amount,data.cardNo,data.customerName,data.invoiceNo,data.customerNumber,res);
  }
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
  baxiPurchaseCable,
  baxiVerifyTransaction
}