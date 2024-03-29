const models = require('../models');
const multer = require('multer');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
const multerConfig = require('../config/multer');
const helpers = require('../utilities/helpers')
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
          maximumPurchaseUnit:data.maximumPurchaseUnit,
          pricePerUnit:parseInt(data.pricePerUnit),
          interestRate:parseInt(data.interestRate),
          period:data.period,
          status:true,
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
  const data = req.body;
  const createInvestment = await models.investmentCategory.update(
    {
      name:data.name,
      type:data.type,
      organization:data.organization,
      maximumPurchaseUnit:data.maximumPurchaseUnit,
      pricePerUnit:parseInt(data.pricePerUnit),
      interestRate:parseInt(data.interestRate),
      period:data.period
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
const editInvestmentPlanPicture = async (req,res)=>{
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
    } 
  
    const createInvestment = await models.investmentCategory.update(
      {
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
  })
}
const getAllInvestmentPlan = async (req,res)=>{
  const investmentPlans = await models.investmentCategory.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        status:true
      }
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
const getAllUnactiveInvestmentPlan = async (req,res)=>{
  const investmentPlans = await models.investmentCategory.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        status:false
      }
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
  const investmentPlan = await models.investmentCategory.findOne(
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
const deactivateInvestmentPlan = async (req,res)=>{
  const investmentPlan = await models.investmentCategory.update(
    {
      status:false
    },
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
const restoreInvestmentPlan = async (req,res)=>{
  const investmentPlan = await models.investmentCategory.update(
    {
      status:true
    },
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
  const amount = parseInt(data.amount);
  const creditCardId = data.creditCardId
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `INVESTMENT-${digits}${firstDigit}`
  let time = new Date();
  time = time.toLocaleString();
  const payment = await options.getPayment();
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
  const investmentPlan = await models.investmentCategory.findOne(
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
  const unit = amount / parseInt(investmentPlan.pricePerUnit);
  if(unit>parseInt(investmentPlan.maximumPurchaseUnit)){
    responseData.status = false;
    responseData.message = "amount exceeds maximum units";
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
    responseData.message = "investment amount not set";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await walletpayment(user,amount,trxRef,time,investmentPlan,res);
  }
  let creditCard;
  if(data.useDefault){
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
    let interestAmount = parseInt(parseFloat(investmentPlan.interestRate)/100 * amount);
    let payout = amount + interestAmount;
    let date = new Date();
    let newDate = new Date(date.setMonth(date.getMonth()+parseInt(investmentPlan.period)))
    const createInvestment = await models.investment.create(
      {
        id:uuid.v4(),
        payout:payout,
        unit:unit,
        investmentCategoryId:planId,
        userId:user.id,
        dueDate:newDate,
        isRedemmed:false,
        status:false
      }
    );
    const addon = JSON.stringify({
      interestRate:investmentPlan.interestRate,
      interestAmount:interestAmount,
      pricePerUnit:investmentPlan.pricePerUnit,
      amount:amount,
      unit:unit,
      payout:payout,
    })
    const payload = {
      amount : amount,
      email : user.email,
      authorizationCode : creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"investment",
      beneficiary:createInvestment.id,
      addon:addon,
      profit:0,
      totalServiceFee:amount
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await walletpayment(user,amount,trxRef,time,investmentPlan,res);
  }
  if(payment.siteName =='monnify'){
    return await walletpayment(user,amount,trxRef,time,investmentPlan,res);
  }

}
const walletpayment = async (user,amount,trxRef,time,investmentPlan,res)=>{
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  let walletBalance = parseInt(wallet.accountBalance);
  if(walletBalance<amount){
    const transaction = await models.transaction.create(
      {
        id:uuid.v4(),
        transactionType:"debit",
        message:"investment",
        beneficiary:investmentPlan.id,
        description:user.firstName + " investing on a plan",
        userId:user.id,
        totalServiceFee:amount,
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
        userId:user.id
      }
    }
  );
  let unit = amount / parseInt(investmentPlan.pricePerUnit);
  let interestAmount = parseInt(parseFloat(investmentPlan.interestRate)/100 * amount);
  let payout = amount + interestAmount;
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let date = new Date();
  date = date.addDays(parseInt(investmentPlan.period));
  const createInvestment = await models.investment.create(
    {
      id:uuid.v4(),
      payout:payout,
      unit:unit,
      investmentCategoryId:investmentPlan.id,
      userId:user.id,
      dueDate:date,
      isRedemmed:false,
      status:true
    }
  );
  const addon = JSON.stringify({
    interestRate:investmentPlan.interestRate,
    interestAmount:interestAmount,
    pricePerUnit:investmentPlan.pricePerUnit,
    amount:amount,
    unit:unit,
    payout:payout,
  })
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
      addon:addon,
      totalServiceFee:amount,
      profit:0,
      status:"successful",
      time: time
    }
  );
  responseData.status = 200;
  responseData.message = "investment successful";
  responseData.data = undefined
  return res.json(responseData);
}
const getAllUserInvestments = async (req,res)=>{
  const user = req.user;
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const investments = await models.investment.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  if(!investments){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investments;
  return res.json(responseData);
}
const getAllInvestments = async (req,res)=>{
  const investments = await models.investment.findAll(
    {
      order:[['createdAt','DESC']],
    }
  );
  if(!investments){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investments;
  return res.json(responseData);
}
const getAllPlanInvestments = async (req,res)=>{
  const investments = await models.investment.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        investmentCategoryId:req.params.planId
      }
    }
  );
  if(!investments){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investments;
  return res.json(responseData);
}
const getInvestment = async (req,res)=>{
  const investments = await models.investment.findOne(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!investments){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investments;
  return res.json(responseData);
}
module.exports = {
  createInvestmentPlan,
  editInvestmentPlan,
  editInvestmentPlanPicture,
  getAllInvestmentPlan,
  getAllUnactiveInvestmentPlan,
  getInvestmentPlan,
  restoreInvestmentPlan,
  deactivateInvestmentPlan,
  invest,
  deleteInvestmentPlan,
  getInvestment,
  getAllUserInvestments,
  getAllPlanInvestments,
  getAllInvestments
}