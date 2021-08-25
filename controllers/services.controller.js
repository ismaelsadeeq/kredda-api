const models = require('../models');
const multer = require('multer');
const uuid = require('uuid');
const helpers = require('../utilities/helpers');
const multerConfig = require('../config/multer');
const shagoApi = require('../utilities/shago.api');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
//Shago
const walletpayment = async (user,trxRef,time,service,phoneNumber,amount,res)=>{
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  const serviceCategory = await models.serviceCategory.findOne(
    {
      where:{
        id:service.serviceCategoryId
      }
    }
  );
  let serviceCharge = serviceCategory.serviceCharge;
  let discount = service.discount;
  let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"airtime purchase",
        beneficiary:"self",
        description:user.firstName + "purchasing airtime for a beneficiary",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time
      }
    );
    responseData.status = false;
    responseData.message = "insufficient funds";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.wallet.update(
    {
      accountBalance:walletBalance - totalAmount
    },
    {
      where:{
        id:wallet.id
      }
    }
  );
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      message:"airtime purchase",
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing airtime for a beneficiary",
      userId:user.id,
      reference:trxRef,
      amount:totalAmount,
      isRedemmed:true,
      status:"successful",
      time: time
    }
  );
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    amount:amount,
    network:service.name,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.airtimePushase(payload,res);
}
const walletDatapayment = async (user,trxRef,time,service,phoneNumber,package,bundle,amount,res)=>{
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  const serviceCategory = await models.serviceCategory.findOne(
    {
      where:{
        id:service.serviceCategoryId
      }
    }
  );
  let serviceCharge = serviceCategory.serviceCharge;
  let discount = service.discount;
  let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"data purchase",
        beneficiary:"self",
        description:user.firstName +" purchasing data for a beneficiary",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time
      }
    );
    responseData.status = false;
    responseData.message = "insufficient funds";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.wallet.update(
    {
      accountBalance:walletBalance - totalAmount
    },
    {
      where:{
        id:wallet.id
      }
    }
  );
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      message:"aitime purchase",
      beneficiary:phoneNumber,
      description:user.firstName + " purchasing airtime for a beneficiary",
      userId:user.id,
      reference:trxRef,
      amount:totalAmount,
      isRedemmed:true,
      status:"successful",
      time: time
    }
  );
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    amount:amount,
    bundle:bundle,
    package:package,
    network:service.name,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.dataPurchase(payload,res)
}
const walletElectricityPayment = async (user,trxRef,time,service,phoneNumber,meterNo,disco,type,name,address,amount,res)=>{
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  const serviceCategory = await models.serviceCategory.findOne(
    {
      where:{
        id:service.serviceCategoryId
      }
    }
  );
  let serviceCharge = serviceCategory.serviceCharge;
  let discount = service.discount;
  let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"electricity purchase",
        beneficiary:"self",
        description:user.firstName +" purchasing electricity unit",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time
      }
    );
    responseData.status = false;
    responseData.message = "insufficient funds";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.wallet.update(
    {
      accountBalance:walletBalance - totalAmount
    },
    {
      where:{
        id:wallet.id
      }
    }
  );
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      message:"electricity purchase",
      beneficiary:phoneNumber,
      description:user.firstName + " purchasing electricity unit",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time
    }
  );
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    amount:amount,
    meterNo:meterNo,
    disco:disco,
    type:type,
    name:name,
    address:address,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.purchaseElectricity(payload,res)
}
const waecPinPurchase = async (user,trxRef,time,service,amount,numberOfPin,res)=>{
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  const serviceCategory = await models.serviceCategory.findOne(
    {
      where:{
        id:service.serviceCategoryId
      }
    }
  );
  let serviceCharge = serviceCategory.serviceCharge;
  let discount = service.discount;
  let totalAmount = parseFloat(amount) + parseFloat(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"waec purchase",
        beneficiary:"self",
        description:user.firstName +" purchasing Waec pin",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time
      }
    );
    responseData.status = false;
    responseData.message = "insufficient funds";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.wallet.update(
    {
      accountBalance:walletBalance - totalAmount
    },
    {
      where:{
        id:wallet.id
      }
    }
  );
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      message:"waec purchase",
      beneficiary:phoneNumber,
      description:user.firstName + " purchasing waec pin",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time
    }
  );
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    amount:amount,
    numberOfPin:numberOfPin,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.waecPinPurchase(payload,res)
}
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
  if(!data.phoneNumber){
    responseData.status = false;
    responseData.message = "phone number is required";
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
    return await walletpayment(user,trxRef,time,service,data.phoneNumber,data.amount,res);
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
    return await walletpayment(user,trxRef,time,service,data.phoneNumber,data.amount,res)
  }
  if(payment.siteName =='monnify'){
    return await walletpayment(user,trxRef,time,service,data.phoneNumber,data.amount,res)
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
    return walletDatapayment(user,trxRef,time,service,data.phoneNumber,data.code,data.allowance,res)
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
    return walletDatapayment(user,trxRef,time,service,data.phoneNumber,data.code,data.allowance,res)
  }
  if(payment.siteName =='monnify'){
    return walletDatapayment(user,trxRef,time,service,data.phoneNumber,data.code,data.allowance,res)
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
    return await walletElectricityPayment(user,trxRef,time,service,data.phoneNumber,data.meterNo,data.disco,data.type,data.name,data.address,data.amount,res);
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
     return await walletElectricityPayment(user,trxRef,time,service,data.phoneNumber,data.meterNo,data.disco,data.type,data.name,data.address,data.amount,res);
  }
  if(payment.siteName =='monnify'){
     return await walletElectricityPayment(user,trxRef,time,service,data.phoneNumber,data.meterNo,data.disco,data.type,data.name,data.address,data.amount,res);
  }
}
const shagoWaecPinLookup = async (req,res)=>{
  return await shagoApi.dataLookup(payload);
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
    return await waecPinPurchase(user,trxRef,time,service,data.amount,data.numberOfPin,res);
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
     return await waecPinPurchase(user,trxRef,time,service,data.amount,data.numberOfPin,res);
  }
  if(payment.siteName =='monnify'){
     return await waecPinPurchase(user,trxRef,time,service,data.amount,data.numberOfPin,res);
  }
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
const baxiPurchaseCable = async (req,res)=>{

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
  baxiPurchaseCable,
  baxiVerifyTransaction
}