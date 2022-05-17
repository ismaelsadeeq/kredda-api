const models = require('../models');
const uuid = require('uuid');
const baxiApi = require('../utilities/baxi.api');
const helpers = require('../middlewares/appSetting')
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const buyAirtime = async (user,trxRef,time,service,phoneNumber,amount,type,plan,res)=>{
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
  let totalAmount = parseInt(amount) + parseInt(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"airtime purchase",
        beneficiary:phoneNumber,
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
    type:type,
    plan:plan,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await baxiApi.purchaseAirtime(payload,res);
}
const buyData = async (user,trxRef,time,service,phoneNumber,amount,type,code,res)=>{
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
  let totalAmount =parseInt(amount) +parseInt(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance =parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"data purchase",
        beneficiary:phoneNumber,
        description:user.firstName + "purchasing data for a beneficiary",
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
      message:"data purchase",
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing data for a beneficiary",
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
    type:type,
    code:code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  return await baxiApi.purchaseData(payload,res);
}
const buyElectricity = async (user,trxRef,time,service,phoneNumber,amount,code,meterNo,res)=>{
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
  let totalAmount =parseInt(amount) +parseInt(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance =parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"electricity purchase",
        beneficiary:meterNo,
        description:user.firstName + "purchasing electricity for a beneficiary",
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
      beneficiary:meterNo,
      description:user.firstName + "purchasing electricity for a beneficiary",
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
    type:code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await baxiApi.purchaseElectricity(payload,res)
}
const buyWaecPin = async (user,trxRef,time,service,pinValue,noOfPins,type,amount,res)=>{
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
  let totalAmount =parseInt(amount) +parseInt(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance =parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"waec pin purchase",
        beneficiary:"self",
        description:user.firstName + "purchasing waec pin for a beneficiary",
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
      message:"waec pin purchase",
      beneficiary:"self",
      description:user.firstName + "purchasing waec pin for a beneficiary",
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
    amount:amount,
    pinValue:pinValue,
    numberOfPins:noOfPins,
    type:type,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await baxiApi.purchaseWaecDirectPin(payload,res);
}
const buyCable = async (user,trxRef,time,service,amount,cardNo,productMonthsPaidFor,productCode,serviceType,addonMonthsPaidFor,addonCode,res)=>{
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
  let totalAmount =parseInt(amount) +parseInt(serviceCharge); 
  if(discount){
    totalAmount = totalAmount  - discount;
  }
  let profit = totalAmount - amount;
  let walletBalance =parseInt(wallet.accountBalance);
  if(walletBalance < totalAmount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"cable purchase",
        beneficiary:cardNo,
        description:user.firstName + "purchasing cable pin for a beneficiary",
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
      message:"cable purchase",
      beneficiary:cardNo,
      description:user.firstName + "purchasing cable for a beneficiary",
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
    amount:amount,
    cardNo:cardNo,
    productMonthsPaidFor:productMonthsPaidFor,
    addonMonthsPaidFor:addonMonthsPaidFor,
    productCode:productCode,
    addonCode:addonCode,
    type:serviceType,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await baxiApi.purchaseCableTv(payload,res);
}
module.exports = {
  buyAirtime,
  buyData,
  buyElectricity,
  buyWaecPin,
  buyCable
}