const models = require('../models');
const uuid = require('uuid');
const shagoApi = require('../utilities/shago.api');
const helpers = require('../middlewares/appSetting')
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
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
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
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
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
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
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
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
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      beneficiary:"self",
      description:user.firstName + " purchasing waec pin",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
    }
  );
  let payload = {
    userId:user.id,
    amount:amount,
    numberOfPin:numberOfPin,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.waecPinPurchase(payload,res)
}
const jambPinPurchase = async (user,trxRef,time,service,type,amount,profileCode,res)=>{
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"jamb pin purchase",
        beneficiary:"self",
        description:user.firstName +" purchasing jamb pin",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      message:"jamb pin purchase",
      beneficiary:"self",
      description:user.firstName + " purchasing jamb pin",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
    }
  );
  let payload = {
    userId:user.id,
    amount:amount,
    type:type,
    profileCode:profileCode,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.jambPinPurchase(payload,res)
}
const dstvPurchase = async (user,trxRef,time,service,amount,cardNo,customerName,packageName,packageCode,period,res)=>{
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"dstv subscribtion",
        beneficiary:"self",
        description:user.firstName +" subscribing to dstv",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      message:"dstv subscribtion",
      beneficiary:"self",
      description:user.firstName +" subscribing to dstv",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
    }
  );
  let payload = {
    userId:user.id,
    amount:amount,
    cardNo:cardNo,
    customerName:customerName,
    packageName:packageName,
    packageCode:packageCode,
    period:period,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.purchaseDstvNoAddOn(payload,res)
}
const dstvPurchaseWithAddOn = async (user,trxRef,time,service,amount,cardNo,customerName,packageName,packageCode,period,addOnCode,addOnProductName,addOnAmount,res)=>{
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"dstv subscribtion with add on",
        beneficiary:"self",
        description:user.firstName +" subscribing to dstv with add on",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      message:"dstv subscribtion with add on",
      beneficiary:"self",
      description:user.firstName +" subscribing to dstv with add on",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
    }
  );
  let payload = {
    userId:user.id,
    amount:amount,
    cardNo:cardNo,
    customerName:customerName,
    packageName:packageName,
    packageCode:packageCode,
    period:period,
    addOnCode:addOnCode,
    addOnProductName:addOnProductName,
    addOnAmount:addOnAmount,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.purchaseDstvWithAddOn(payload,res)
}
const startimesPurchase = async (user,trxRef,time,service,amount,cardNo,customerName,packageName,res)=>{
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"startimes subscribtion",
        beneficiary:"self",
        description:user.firstName +" subscribing to startimes",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      message:"startimes subscribtion",
      beneficiary:"self",
      description:user.firstName +" subscribing to startimes",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
    }
  );
  let payload = {
    userId:user.id,
    amount:amount,
    cardNo:cardNo,
    customerName:customerName,
    packageName:packageName,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.startimesPurchase(payload,res)
}
const goTvPurchase = async (user,trxRef,time,service,amount,cardNo,customerName,packageName,packageCode,period,res)=>{
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let vatAddition = (parseFloat(serviceCategory.vat) / 100) * amount;
  let totalAmount = (parseInt(amount) + parseInt(serviceCharge)) + vatAddition;   
  if(discount){
    totalAmount = totalAmount  - discount;
  }
    let addons = JSON.stringify(
    {
      serviceCharge:serviceCharge,
      vat:serviceCategory.vat,
      discount:discount
    }
  )
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"startimes subscribtion",
        beneficiary:"self",
        description:user.firstName +" subscribing to startimes",
        userId:user.id,
        reference:trxRef,
        amount:amount,
        status:"failed",
        time: time,
        totalServiceFee:totalAmount,
        addon:addons,
        profit:profit
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
      message:"startimes subscribtion",
      beneficiary:"self",
      description:user.firstName +" subscribing to startimes",
      userId:user.id,
      reference:trxRef,
      isRedemmed:true,
      amount:totalAmount,
      status:"successful",
      time: time,
      totalServiceFee:totalAmount,
      addon:addons,
      profit:profit
    }
  );
  let payload = {
    userId:user.id,
    amount:amount,
    cardNo:cardNo,
    customerName:customerName,
    packageName:packageName,
    packageCode:packageCode,
    period:period,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await shagoApi.goTvPurchase(payload,res)
}
module.exports = {
  walletpayment,
  walletDatapayment,
  walletElectricityPayment,
  waecPinPurchase,
  jambPinPurchase,
  dstvPurchase,
  dstvPurchaseWithAddOn,
  startimesPurchase,
  goTvPurchase
}