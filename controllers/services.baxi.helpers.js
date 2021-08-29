const models = require('../models');
const uuid = require('uuid');
const baxiApi = require('../utilities/baxi.api');
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
module.exports = {
  buyAirtime
}