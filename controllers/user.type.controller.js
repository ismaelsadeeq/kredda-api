const models = require('../models');
const helpers = require('../utilities/helpers');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api')
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
      discountRate:data.discountRate,
      period:data.period,
      fee:parseInt(data.fee)
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
      discountRate:data.discountRate,
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
  const userCategories = await models.userCategory.findAll(
    {
      order:[['createdAt','DESC']]
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
  responseData.data = userCategories;
  return res.json(responseData);
}
const getUserOfCategories = async (req,res)=>{
  const admin = req.user;
  const id = req.params.id;
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
  const userCategories = await models.userType.findAll(
    {
      where:{
        userCategoryId:id
      },
      order:[['createdAt','DESC']],
      include:[{model:models.user}]
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
  responseData.data = userCategories;
  return res.json(responseData);
}
const getAllUserOfCategories = async (req,res)=>{
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
  const userCategories = await models.userType.findAll(
    {
      order:[['createdAt','DESC']],
      include:[{model:models.user}]
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
  responseData.data = userCategories;
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
  const data = req.body;
  const categoryId = req.params.id;
  const user = req.user;
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `PARTNER-${digits}${firstDigit}`;
  const userType = await models.userType.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(userType){
    responseData.status = false;
    responseData.message = "user has already partner";
    responseData.data = undefined;
    return res.json(responseData);
  }
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
    let fee = parseInt(category.fee);
    let walletBalance = parseInt(wallet.accountBalance);
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
          totalServiceFee:fee,
          profit:0,
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
        id:uuid.v4(),
        transactionType:"debit",
        message:"partnership ",
        beneficiary:"self",
        description:user.firstName + "parnering",
        userId:user.id,
        reference:trxRef,
        amount:fee,
        totalServiceFee:fee,
        profit:0,
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
    date = date.addDays(parseInt(category.period));
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
    responseData.data = userType;
    return res.json(responseData);
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
    let amount = parseInt(category.fee);
    let beneficiary = {
      category:category.id,
      userId:user.id,
    }
    beneficiary = JSON.stringify(beneficiary);
    const payload = {
      amount:amount,
      email:user.email,
      authorizationCode:creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"partnership",
      beneficiary:beneficiary,
      totalServiceFee:amount
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    responseData.status = 200;
    responseData.message = "gateway not supported";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='monnify'){
    responseData.status = 200;
    responseData.message = "gateway not supported";
    responseData.data = undefined
    return res.json(responseData);
  }
}
const checkPartnerWithCategory = async (req,res)=>{
  const admin = await models.admin.findOne(
    {
      where:{
        id:req.user.id
      }
    }
  );
  if(!admin){
    res.statusCode = 401;
    return res.json('Unauthorize')
  }
  const id = req.params.id;
  const check = await models.userType.findOne(
    {
      where:{
        userId:id
      }
    }
  );
  if(check){
    responseData.data = "Subscribed";
    responseData.status = true;
    responseData.message = "completed";
    return res.json(responseData)
  }
  responseData.data = Regular;
  responseData.status = false;
  responseData.message = "failed";
  return res.json(responseData)
}
const adminGetPartnerWithCategory = async (req,res)=>{
  const admin = await models.admin.findOne(
    {
      where:{
        id:req.user.id
      }
    }
  );
  if(!admin){
    res.statusCode = 401;
    return res.json('Unauthorize')
  }
  const id = req.params.id;
  const check = await models.userType.findOne(
    {
      where:{
        userId:id
      }
    }
  );
  if(check){
    const category =  await models.userCategory.findOne(
      {
        where:{
          id:check.userCategoryId
        }
      }
    )
    let date = new Date(check.dueDate);
    date = date.toLocaleString();
    responseData.data = {category,dueDate:date}
    responseData.status = true;
    responseData.message = "completed";
    return res.json(responseData)
  }
  responseData.data = undefined;
  responseData.status = false;
  responseData.message = "failed";
  return res.json(responseData)
}
const userGetPartnerWithCategory = async (req,res)=>{
  const check = await models.userType.findOne(
    {
      where:{
        userId:req.user.id
      }
    }
  );
  if(check){
    const category =  await models.userCategory.findOne(
      {
        where:{
          id:check.userCategoryId
        }
      }
    )
    let date = new Date(check.dueDate);
    date = date.toLocaleString();
    responseData.data = {category,dueDate:date}
    responseData.status = true;
    responseData.message = "completed";
    return res.json(responseData)
  }
  responseData.data = undefined;
  responseData.status = false;
  responseData.message = "failed";
  return res.json(responseData)
}
module.exports = {
  createUserCategory,
  editUserCategory,
  getUserCategories,
  deleteUserCategory,
  partnerWithCategory,
  checkPartnerWithCategory,
  adminGetPartnerWithCategory,
  userGetPartnerWithCategory,
  getUserOfCategories,
  getAllUserOfCategories
}