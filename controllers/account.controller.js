const models = require('../models');
const uuid = require('uuid');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createAccountType = async (req,res)=>{
  const admin = req.user;
  const data = req.body;
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
  const accountType = await models.accountType.create(
    {
      id:uuid.v4(),
      name:data.name,
      currency:data.currency,
      currencyCode:data.currencyCode,
      serviceFee:data.serviceFee,
      status:true
    }
  );
  if(!accountType){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = accountType;
  return res.json(responseData);
}
const editAccountType = async (req,res)=>{
  const admin = req.user;
  const data = req.body;
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
  const accountType = await models.accountType.update(
    {
      name:data.name,
      currencyCode:data.currencyCode,
      currency:data.currency,
      serviceFee:data.serviceFee,
      status:true
    },
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!accountType){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "account type updated";
  responseData.data = accountType;
  return res.json(responseData);
  
}
const getAllAccountTypes = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const accountTypes = await models.accountType.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!accountTypes){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = accountTypes;
  return res.json(responseData);
}
const getAccountType = async (req,res)=>{
  const accountType = await models.accountType.findOne(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!accountType){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = accountType;
  return res.json(responseData);
}
const deleteAccountType = async (req,res)=>{
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
  const accountType = await models.accountType.update(
    {
      status:false
    },
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!accountType){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "deleted";
  responseData.data = accountType;
  return res.json(responseData);
  
}
const createAccount = async (req,res)=>{
  const user = req.user;
  console.log(req.params.accountTypeId)
  const accountType = await models.accountType.findOne(
    {
      where:{
        id:req.params.accountTypeId,
        status:true,
      }
    }
  );
  console.log(accountType)
  if(!accountType){
    responseData.status = false;
    responseData.message = "account type doesnt exist or suspended";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const accountExist = await models.otherAccount.findOne(
    {
      where:{
        accountTypeId:req.params.accountTypeId,
        userId:user.id
      }
    }
  )
  if(accountExist){
    responseData.status = true;
    responseData.message = "user has an account";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const account = await models.otherAccount.create(
    {
      id:uuid.v4(),
      accountTypeId:req.params.accountTypeId,
      userId:user.id,
      status:0,
      accountBalance:"0.0"
    }
  );
  if(!account){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = account;
  return res.json(responseData);
}
const fundAccount = async (req,res)=>{
  const id = req.params.id;
  const trueAccount = await models.otherAccount.findOne(
    {
      where:
      {
        status:true
      }
    }
  );
  if(trueAccount){
    await models.otherAccount.update(
      {
        status:false
      },
      {
        where:
        {
          id:trueAccount.id
        }
      }
    );
  }
  const account = await models.otherAccount.update(
    {
      status:true
    },
    {
      where:
      {
        id:id
      }
    }
  );
  if(!account){
    res.statusCode = 200
    responseData.status = false;
    responseData.message = "something went wrong";
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "account is ready to be funded";
  responseData.data = undefined;
  return res.json(responseData)
}
const getAccounts = async (req,res)=>{
  const user = req.user;
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const accounts = await models.otherAccount.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  if(!accounts){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = accounts;
  return res.json(responseData);
  
}
const getAccount = async (req,res)=>{
  const account = await models.otherAccount.findOne(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!account){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = account;
  return res.json(responseData);
  
}
const disableAccount = async (req,res)=>{
  const account = await models.otherAccount.findOne(
    {
      where:{
        id:req.params.id,
        accountBalance:0
      }
    }
  );
  if(!account){
    responseData.status = false;
    responseData.message = "account not found or cant be deleted because there are funds!";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.otherAccount.destroy(
    {
      where:{
        id:req.params.id,
        accountBalance:0
      }
    }
  )
  responseData.status = true;
  responseData.message = "account disabled";
  responseData.data = account;
  return res.json(responseData);
}
module.exports = {
  createAccountType,
  editAccountType,
  getAllAccountTypes,
  getAccountType,
  deleteAccountType,
  createAccount,
  fundAccount,
  getAccounts,
  getAccount,
  disableAccount
}