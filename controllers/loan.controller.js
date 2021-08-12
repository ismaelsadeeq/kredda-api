const models = require('../models');
const uuid = require('uuid');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createLoanCategory = async (req,res)=>{
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
  const createLoan = await models.loanCategory.create(
    {
      id:uuid.v4(),
      name:data.name,
      type:data.type,
      interestRate:data.interestRate,
      defaultInterest:data.defaultInterest,
      interestAmount:data.interestAmount,
      maximumAmount:data.maximumAmount,
      maximumDuration:data.maximumDuration,
      status:true
    }
  );
  if(!createLoan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = createLoan;
  return res.json(responseData);
}
const changeStatusToFalse = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const data = req.body;
    const loan = await models.loanCategory.update(
      {
        status:false
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "loan category updated to false";
    responseData.data = undefined;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const changeStatusToTrue = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const data = req.body;
    const loan = await models.loanCategory.update(
      {
        status:true
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "loan category updated to true";
    responseData.data = undefined;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const editLoanCategory = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const data = req.body;
    const loan = await models.loanCategory.update(
      {
        name:data.name,
        type:data.type,
        interestRate:data.interestRate,
        defaultInterest:data.defaultInterest,
        interestAmount:data.interestAmount,
        maximumAmount:data.maximumAmount,
        maximumDuration:data.maximumDuration,
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
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
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getAllLoanCategories = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const loanCategory = await models.loanCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!loanCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = loanCategory;
  return res.json(responseData);
}
const getAllActiveLoanCategories = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const loanCategory = await models.loanCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        status:true
      }
    }
  );
  if(!loanCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = loanCategory;
  return res.json(responseData);
}
const getLoanCategory = async (req,res)=>{
  const loanCategory = await models.loanCategory.findAll(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!loanCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = loanCategory;
  return res.json(responseData);
}
const deleteLoanCategory = async (req,res)=>{
  const loanCategory = await models.loanCategory.destroy(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!loanCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "deleted";
  responseData.data = loanCategory;
  return res.json(responseData);
}
module.exports = {
  createLoanCategory,
  changeStatusToFalse,
  changeStatusToTrue,
  editLoanCategory,
  getAllLoanCategories,
  getAllActiveLoanCategories,
  getLoanCategory,
  deleteLoanCategory
}