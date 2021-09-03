const models = require('../models');
const helpers = require('../utilities/helpers');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
//categories
const createUserCategory = async (req,res)=>{
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
  if(!data){
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const createUserCategory = await models.userCategory.create(
    {
      id:uuid.v4(),
      name:data.name,
      discountRate:data.discountRate
      serviceCharge:data.serviceCharge,
      period:data.period,
      fee:data.fee
    }
  );
  if(!createUserCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = createUserCategory;
  return res.json(responseData);
}
const editUserCategory = async (req,res)=>{
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
  if(!data){
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const id = req.params.id;
  if(!id){
    responseData.status = false;
    responseData.message = "id is required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const updateUserCategory = await models.userCategory.update(
    {
      name:data.name,
      discountRate:data.discountRate
      serviceCharge:data.serviceCharge,
      period:data.period,
      fee:data.fee
    },
    {
      where:{
        id:id
      }
    }
  );
  if(!updateUserCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = updateUserCategory;
  return res.json(responseData);
}
const getUserCategories = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const userCategories = await models.userCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!userCategories){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = serviceCategories;
  return res.json(responseData);
}
const deleteUserCategory = async (req,res)=>{
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
  const userCategory = await models.userCategory.destroy(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!userCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "deleted";
  responseData.data = userCategory;
  return res.json(responseData);
}
const partnerWithCategory = async (req,res)=>{
  const categoryId = req.params.id;
  const user = req.user;
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `PARTNER-${digits}${firstDigit}`
  const category = await models.userCategory.findOne(
    {
      where:{
        id:categoryId
      }
    }
  );
  if(!category){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    let time = new Date();
    time = time.toLocaleString();
    const wallet = await models.wallet.findOne(
      {
        where:{
          userId:user.id
        }
      }
    );
    let fee = parseFloat(category.fee);
    let walletBalance = parseFloat(wallet.accountBalance);
    if(walletBalance < fee){
      const transaction = await models.transaction.create(
        {
          id:uuid.v4(),
          transactionType:"debit",
          message:"partnership ",
          beneficiary:"self",
          description:user.firstName + "parnering",
          userId:user.id,
          reference:trxRef,
          amount:fee,
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
        accountBalance:walletBalance - fee
      },
      {
        where:{
          id:wallet.id
        }
      }
    );
    const transaction = await models.transaction.create(
      {
        transactionType:"debit",
        message:"partnership ",
        beneficiary:"self",
        description:user.firstName + "parnering",
        userId:user.id,
        reference:trxRef,
        amount:fee,
        isRedemmed:true,
        status:"successful",
        time: time
      }
    );
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    let date = new Date();
    date = date.addDays(parseFloat(category.period));
    const userType = await models.userType.create(
      {
        id:uuid.v4(),
        userId:user.id,
        userCategoryId:category.id,
        dueDate:date
      }
    );
    responseData.status = true;
    responseData.message = "parnership successful";
    responseData.data = undefined;
    return res.json(responseData);
  }
  let creditCard;
  let useDefault = data.useDefault;
  let creditCardId = data.creditCardId;
  const payment = await options.getPayment();
  let creditCardId = data.creditCardId;
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
    let amount = category.fee;
    let beneficiary = {
      category:cetegory.id,
      userId:user.id,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:amount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"parnership",
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
module.exports = {
  createUserCategory,
  editUserCategory,
  getUserCategories,
  deleteUserCategory,
  partnerWithCategory
}