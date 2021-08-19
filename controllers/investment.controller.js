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
const createInvestmentPlan = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(!user){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  multerConfig.singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
      return res.json(err);
    } else if(req.body) {
      const data = req.body;
      const createInvestment = await models.investmentCategory.create(
        {
          id:uuid.v4(),
          name:data.name,
          type:data.type,
          organization:data.organization,
          pricePerUnit:data.pricePerUnit,
          interestRate:data.interestRate,
          period:data.period,
          picture:req.file.path
        }
      );
      if(!createInvestment){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = createInvestment;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const editInvestmentPlan = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(!user){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  multerConfig.singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
      return res.json(err);
    } else if(req.body){
      const data = req.body;
      const createInvestment = await models.investmentCategory.update(
        {
          name:data.name,
          type:data.type,
          organization:data.organization,
          pricePerUnit:data.pricePerUnit,
          interestRate:data.interestRate,
          period:data.period,
          picture:req.file.path
        },
        {
          where:{
            id:req.params.id
          }
        }
      );
      if(!createInvestment){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
      }
      responseData.status = true;
      responseData.message = "updated";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const getAllInvestmentPlan = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const investmentPlans = await models.investmentCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!investmentPlans){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investmentPlans;
  return res.json(responseData);
}
const getInvestmentPlan = async (req,res)=>{
  const investmentPlan = await models.investmentCategory.findAll(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!investmentPlan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investmentPlan;
  return res.json(responseData);
}
const deleteInvestmentPlan = async (req,res)=>{
  const investmentPlan = await models.investmentCategory.destroy(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!investmentPlan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investmentPlan;
  return res.json(responseData);
}
const invest = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  const planId = req.params.planId;
  const amount = parseFloat(data.amount);
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `INVESTMENT-${digits}${firstDigit}`
  let time = new Date();
  time = time.toLocaleString()
  const card = await models.creditCard.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(!card){
    responseData.status = false;
    responseData.message = "user must add credit card before investing";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const investmentPlan = await models.investmentCategory.findAll(
    {
      where:{
        id:planId
      }
    }
  );
  if(!investmentPlan){
    responseData.status = false;
    responseData.message = "investment plan does not exist";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(!wallet){
    responseData.status = false;
    responseData.message = "user account not verified";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(!amount){
    responseData.status = false;
    responseData.message = "loan amount not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await walletpayment(user,data,amount,trxRef,time,investmentPlan,res);
  }
  let creditCard;
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
    let unit = amount / parseFloat(investmentPlan.pricePerUnit);
    let interestAmount = parseFloat(investmentPlan.interestRate) * amount;
    let payout = amount + interestAmount;
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    let date = new Date();
    date = date.addDays(parseFloat(investmentPlan.period));
    const createInvestment = await models.investment.create(
      {
        payout:payout,
        unit:unit,
        investmentCategoryId:investmentPlan.id,
        userId:user.id,
        autoRenewal:data.isAutoRenewal,
        dueDate:date,
        isRedemmed:false,
        status:false
      }
    );
    const payload = {
      amount : amount,
      email : user.email,
      authorizationCode : creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"investment",
      beneficiary:createInvestment.id,
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await walletpayment(user,data,amount,trxRef,time,investmentPlan,res);
  }
  if(payment.siteName =='monnify'){
    return await walletpayment(user,data,amount,trxRef,time,investmentPlan,res);
  }

}
const walletpayment = async (user,data,amount,trxRef,time,investmentPlan,res)=>{
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance<amount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"investment",
        beneficiary:investmentPlan.id,
        description:user.firstName + " investing for loan",
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
      accountBalance:walletBalance - amount
    },
    {
      where:{
        id:wallet.id
      }
    }
  );
  let unit = amount / parseFloat(investmentPlan.pricePerUnit);
  let interestAmount = parseFloat(investmentPlan.interestRate) * amount;
  let payout = amount + interestAmount;
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let date = new Date();
  date = date.addDays(parseFloat(investmentPlan.period));
  const createInvestment = await models.loan.update(
    {
      payout:payout,
      unit:unit,
      investmentCategoryId:investmentPlan.id,
      userId:user.id,
      autoRenewal:data.isAutoRenewal,
      dueDate:date,
      isRedemmed:false,
      status:true
    }
  );
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      message:"investment",
      beneficiary:createInvestment.id,
      description:user.firstName + " investing on a plan",
      userId:user.id,
      reference:trxRef,
      amount:amount,
      status:"successful",
      time: time
    }
  );
  responseData.status = 200;
  responseData.message = "investment successful";
  responseData.data = undefined
  return res.json(responseData);
}
module.exports = {
  createInvestmentPlan,
  editInvestmentPlan,
  getAllInvestmentPlan,
  getInvestmentPlan,
  deleteInvestmentPlan,
  invest
}