const models = require('../models');
const uuid = require('uuid');
const mobileAirtime = require('../utilities/mobile.airtime.api');
const helpers = require('../middlewares/appSetting')
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
        message:"mtn vtu airtime purchase",
        beneficiary:"self",
        description:user.firstName + "purchasing mtn vtu airtime for a beneficiary",
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
      message:" mtn vtu airtime purchase",
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing mtn vtu airtime for a beneficiary",
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
    transactionId:transaction.id,
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
  );;
  let payload = {
    userId:user.id,
    transactionId:transaction.id,
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
  let predifinedDiscount = service.discount;
  let discount = await helpers.getDiscount(user.id,predifinedDiscount);
  let totalAmount = parseInt(amountInNaira) + parseInt(serviceCharge); 
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
        message:"foreign airtime purchase",
        beneficiary:"self",
        description:user.firstName + " purchasing airtime for a foreign beneficiary",
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
      message:"foreign airtime purchase",
      beneficiary:phoneNumber,
      description:user.firstName + " purchasing airtime for a foreign beneficiary",
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
    transactionId:transaction.id,
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
        message:"mtn data gifting",
        beneficiary:phoneNumber,
        description:user.firstName + "gifting mobile data for a beneficiary",
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
      message:"mtn data gifting",
      beneficiary:phoneNumber,
      description:user.firstName + "gifting mobile data for a beneficiary",
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
  );;
  let payload = {
    userId:user.id,
    transactionId:transaction.id,
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
        message:"mtn data share",
        beneficiary:phoneNumber,
        description:user.firstName + "sharing mobile data for a beneficiary",
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
      message:"mtn data share",
      beneficiary:phoneNumber,
      description:user.firstName + "sharing mobile data for a beneficiary",
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
  );;
  let payload = {
    userId:user.id,
    transactionId:transaction.id,
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
        beneficiary:phoneNumber,
        description:user.firstName + "purchasing data for a beneficiary",
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
      message:"data purchase",
      beneficiary:phoneNumber,
      description:user.firstName + "purchasing data for a beneficiary",
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
  );;
  let payload = {
    userId:user.id,
    transactionId:transaction.id,
    amount:amount,
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
        beneficiary:meterNo,
        description:user.firstName + "purchasing electricity for a beneficiary",
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
      beneficiary:meterNo,
      description:user.firstName + "purchasing electricity for a beneficiary",
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
  );;
  let payload = {
    userId:user.id,
    transactionId:transaction.id,
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
        message:"waec pin purchase",
        beneficiary:"self",
        description:user.firstName + "purchasing waec pin for a beneficiary",
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
      message:"waec pin purchase",
      beneficiary:"self",
      description:user.firstName + "purchasing waec pin for a beneficiary",
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
  );;
  let payload = {
    addon:addons,
    amount:amount,
    transactionId:transaction.id,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.purchaseWeacDirect(payload,res);
}
const necoPinPurchase = async (user,trxRef,time,service,amount,res)=>{
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
        message:"neco pin purchase",
        beneficiary:"self",
        description:user.firstName + "purchasing neco pin for a beneficiary",
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
      message:"neco pin purchase",
      beneficiary:"self",
      description:user.firstName + "purchasing neco pin for a beneficiary",
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
  );;
  let payload = {
    amount:amount,
    transactionId:transaction.id,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.purchaseNecoDirect(payload,res);
}
const tvRecharge = async (user,trxRef,time,service,amount,cardNo,customerName,invoiceNo,customerNumber,phoneNumber,type,res)=>{
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
        message:`${type} subscription`,
        beneficiary:"self",
        description:user.firstName + `subscribing ${type} for a beneficiary`,
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
      message:`${type} subscription`,
      beneficiary:"self",
      description:user.firstName + `subscribing ${type} subscription for a beneficiary`,
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
  );;
  let payload = {
    addon:addons,
    amount:amount,
    transactionId:transaction.id,
    cardNo:cardNo,
    customerName:customerName,
    invoiceNo:invoiceNo,
    phoneNumber:phoneNumber,
    customerNumber:customerNumber,
    type:type,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.rechargeGoOrDstv(payload,res);
}
const startimesRecharge = async (user,trxRef,time,service,amount,cardNo,phoneNumber,res)=>{
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
        message:"startimes subscription ",
        beneficiary:"self",
        description:user.firstName + "subscribing startimes for a beneficiary",
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
      message:"startimes subscription ",
      beneficiary:"self",
      description:user.firstName + "subscribing startimes for a beneficiary",
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
    amount:amount,
    addon:addons,
    transactionId:transaction.id,
    cardNo:cardNo,
    phoneNumber:phoneNumber,
    reference:trxRef,
    serviceId:service.id,
    totalServiceFee:totalAmount,
    profit:profit
  }
  await mobileAirtime.rechargeStartimes(payload,res);
}
module.exports = {
	mtnVTUTopUp,
	airtimePurchase,
  foreignAirtimePurchase,
  mtnDataGifting,
  mtnDataShare,
  dataTopUp,
  purchaseElectricity,
  waecPinPurchase,
  necoPinPurchase,
  tvRecharge,
  startimesRecharge
}