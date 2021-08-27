const models = require('../models');
const uuid = require('uuid');
const mobileAirtime = require('../utilities/mobile.airtime.api');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
//Mobile Airtime
const mtnVTUTopUp = async (user,trxRef,time,service,phoneNumber,amount,res)=>{
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
        message:"mtn vtu airtime purchase",
        beneficiary:"self",
        description:user.firstName + "purchasing mtn vtu airtime for a beneficiary",
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
      message:" mtn vtu airtime purchase",
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing mtn vtu airtime for a beneficiary",
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
    network:service.code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.mtnVTUTopUp(payload,res);
}
const airtimePurchase = async (user,trxRef,time,service,phoneNumber,amount,res)=>{
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
  );;
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    amount:amount,
    network:service.code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.airtimeTopUp(payload,res);
}
const foreignAirtimePurchase = async (user,trxRef,time,service,phoneNumber,amount,amountInNaira,product,country,res)=>{
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
  let totalAmount = parseFloat(amountInNaira) + parseFloat(serviceCharge); 
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
        message:"foreign airtime purchase",
        beneficiary:"self",
        description:user.firstName + " purchasing airtime for a foreign beneficiary",
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
      message:"foreign airtime purchase",
      beneficiary:phoneNumber,
      description:user.firstName + " purchasing airtime for a foreign beneficiary",
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
    country:country,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    productId:product,
    profit:profit
  }
  await mobileAirtime.rechargeInternationalNumber(payload,res);
}
const mtnDataGifting = async (user,trxRef,time,service,phoneNumber,amount,dataSize,res)=>{
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
        message:"mtn data gifting",
        beneficiary:phoneNumber,
        description:user.firstName + "gifting mobile data for a beneficiary",
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
      message:"mtn data gifting",
      beneficiary:phoneNumber,
      description:user.firstName + "gifting mobile data for a beneficiary",
      userId:user.id,
      reference:trxRef,
      amount:totalAmount,
      isRedemmed:true,
      status:"successful",
      time: time
    }
  );;
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    dataSize:dataSize,
    network:service.code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.mtnDataGifting(payload,res);
}
const mtnDataShare = async (user,trxRef,time,service,phoneNumber,amount,dataSize,res)=>{
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
        message:"mtn data share",
        beneficiary:phoneNumber,
        description:user.firstName + "sharing mobile data for a beneficiary",
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
      message:"mtn data share",
      beneficiary:phoneNumber,
      description:user.firstName + "sharing mobile data for a beneficiary",
      userId:user.id,
      reference:trxRef,
      amount:totalAmount,
      isRedemmed:true,
      status:"successful",
      time: time
    }
  );;
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    dataSize:dataSize,
    network:service.code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.mtnDataShare(payload,res);
}
const dataTopUp = async (user,trxRef,time,service,phoneNumber,amount,res)=>{
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
  );;
  let payload = {
    userId:user.id,
    phoneNumber:phoneNumber,
    network:service.code,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.dataTopUp(payload,res);
}
const purchaseElectricity = async (user,trxRef,time,service,amount,serviceId,meterNo,type,res)=>{
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
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing electricity for a beneficiary",
      userId:user.id,
      reference:trxRef,
      amount:totalAmount,
      isRedemmed:true,
      status:"successful",
      time: time
    }
  );;
  let payload = {
    userId:user.id,
    meterNo:meterNo,
    type:type,
    amount:amount,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.purchaseElectricity(payload,res);
}
const waecPinPurchase = async (user,trxRef,time,service,amount,res)=>{
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
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing waedc pin for a beneficiary",
      userId:user.id,
      reference:trxRef,
      amount:totalAmount,
      isRedemmed:true,
      status:"successful",
      time: time
    }
  );;
  let payload = {
    amount:amount,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.purchaseElectricity(payload,res);
}
module.exports = {
	mtnVTUTopUp,
	airtimePurchase,
  foreignAirtimePurchase,
  mtnDataGifting,
  mtnDataShare,
  dataTopUp,
  purchaseElectricity,
  waecPinPurchase
}