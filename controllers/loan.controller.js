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
const applyForAloan = async(req,res)=>{
  const user = req.user;
  const data = req.body;
  const categoryId = req.params.categoryId;
  const amount = parseFloat(data.amount);
  const loanCategory = await models.loanCategory.findOne(
    {
      where:{
        id:categoryId
      }
    }
  );
  if(!loanCategory){
    responseData.status = false;
    responseData.message = "loan category does not exist";
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
  let maximumAmount = parseFloat(loanCategory.maximumAmount);
  if(amount > maximumAmount){
    responseData.status = false;
    responseData.message = "loan amount exceeds maximum loan amount";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const createLoan = await models.loan.create(
    {
      id:uuid,
      userId:user.id,
      loanCategoryId:categoryId,
      amount:amount
    }
  );
  if(!createLoan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "loan applied successfully";
  responseData.data = createLoan;
  return res.json(responseData);

}

const userGetLoans = async(req,res)=>{
  const user = req.user;
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  if(!loans){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = loans;
  return res.json(responseData);
}
const getAppliedLoans = async(req,res)=>{
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
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        isApproved:false
      }
    }
  );
  if(!loans){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = loans;
  return res.json(responseData);
}
const getAppliedLoan = async(req,res)=>{
  const loanId = req.params.id;
  const loan = await models.loan.findOne(
    {
      where:{
        id:loanId
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
  responseData.message = "completed";
  responseData.data = loan;
  return res.json(responseData);
}
const approveALoan = async(req,res)=>{
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
  const loanId = req.params.id;
  const loan = await models.loan.findOne(
    {
      where:{
        id:loanId
      }
    }
  );
  if(!loan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const loanCategory = await models.loanCategory.findOne(
    {
      where:{
        id:loan.loanCategoryId
      }
    }
  );
  let interestRate = parseFloat(loanCategory.interestRate) / 100;
  let interestAmount = interestRate * parseFloat(loan.amount);
  let amountToBePaid = interestAmount + parseFloat(loan.amount);
  await models.loan.update(
    {
      isApproved:true,
      amountToBePaid:amountToBePaid,
      amoundPaid:"0.0",
      remainingBalance:amountToBePaid,
      isPaid:false
    },
    {
      where:{
        id:loanId
      }
    }
  );
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:loan.userId
      }
    }
  );
  let walletBalance = parseFloat(wallet.accountBalance) + parseFloat(loan.amount);
  await models.wallet.update(
    {
      accountBalance:walletBalance
    },
    {
      where:{
        userId:loan.userId
      }
    }
  );
  responseData.status = true;
  responseData.message = "loan approved and user funded";
  responseData.data = loan;
  return res.json(responseData);
}
const disapproveALoan = async(req,res)=>{
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
  const loanId = req.params.id;
  const loan = await models.loan.findOne(
    {
      where:{
        id:loanId
      }
    }
  );
  if(!loan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.loan.update(
    {
      isApproved:false
    },
    {
      where:{
        id:loanId
      }
    }
  );
  responseData.status = true;
  responseData.message = "loan disapproved";
  responseData.data = loan;
  return res.json(responseData);
}
const userPayLoan = async(req,res)=>{
  const user = req.user;
  const loanId = req.params.id;
  const data = req.body;
  const amount = parseFloat(data.amount);
  const loan = await models.loan.findOne(
    {
      where:{
        id:loanId,
        isPaid:false
      }
    }
  );
  if(!loan){
    responseData.status = false;
    responseData.message = "something went wrong";
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
  let walletBalance = parseFloat(wallet.accountBalance);
  if(walletBalance>amount){
    responseData.status = false;
    responseData.message = "insufficient funds";
    responseData.data = undefined;
    return res.json(responseData);
  }
  await models.loan.update(
    {
      amoundPaid:parseInt(loan.amoundPaid) + amount,
      remainingBalance:parseInt(loan.remainingBalance) - amount,
    },
    {
      where:{
        id:loanId
      }
    }
  );
  const updatedLoan = await models.loan.findOne(
    {
      where:{
        id:loanId
      }
    }
  );
  const amoundPaid = parseFloat(updatedLoan.amoundPaid);
  const amountToBePaid = parseFloat(updatedLoan.amountToBePaid);
  if(amoundPaid==amountToBePaid){
    await models.loan.update(
      {
        isPaid:true
      },
      {
        where:{
          id:loanId
        }
      }
    );
  }
  responseData.status = true;
  responseData.message = "loan payment successful";
  responseData.data = undefined;
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
  deleteLoanCategory,
  applyForAloan,
  userGetLoans,
  getAppliedLoans,
  getAppliedLoan,
  approveALoan,
  disapproveALoan,
  userPayLoan
}