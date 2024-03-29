const models = require('../models');
const uuid = require('uuid');
const helpers = require('../utilities/helpers');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
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
  if(data.hasExpiryFee){
    if(data.expiryFeeAmount && data.expiryPercentage){
      responseData.status = false;
      responseData.message = "you cannot specify expiry fee and expiry percentage at the same time";
      responseData.data = undefined;
      return res.json(responseData);
    }
  }
  const createLoan = await models.loanCategory.create(
    {
      id:uuid.v4(),
      name:data.name,
      type:data.type,
      interestRate:parseInt(data.interestRate),
      defaultInterest:parseInt(data.defaultInterest),
      interestAmount:parseInt(data.interestAmount),
      maximumAmount:parseInt(data.maximumAmount),
      maximumDuration:data.maximumDuration,
      status:true,
      hasExpiryFee:data.hasExpiryFee,
      expiryFeeAmount:parseInt(data.expiryFeeAmount),
      expiryPercentage:parseInt(data.expiryPercentage)
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
        interestRate:parseInt(data.interestRate),
        defaultInterest:parseInt(data.defaultInterest),
        interestAmount:parseInt(data.interestAmount),
        maximumAmount:parseInt(data.maximumAmount),
        maximumDuration:data.maximumDuration,
        hasExpiryFee:data.hasExpiryFee,
        expiryFeeAmount:parseInt(data.expiryFeeAmount),
        expiryPercentage:parseInt(data.expiryPercentage)
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
  const loanCategory = await models.loanCategory.findAll(
    {
      order:[['createdAt','DESC']],
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
const getAllUnactiveLoanCategories = async (req,res)=>{
  const loanCategory = await models.loanCategory.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        status:false
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
  const loanCategory = await models.loanCategory.findOne(
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
  const amount = parseInt(data.amount);
  const creditCard = await models.creditCard.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(!creditCard){
    responseData.status = false;
    responseData.message = "user must add credit card before applying for a loan";
    responseData.data = undefined;
    return res.json(responseData);
  }
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
  let maximumAmount = parseInt(loanCategory.maximumAmount);
  if(amount > maximumAmount){
    responseData.status = false;
    responseData.message = "loan amount exceeds maximum loan amount";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const createLoan = await models.loan.create(
    {
      id:uuid.v4(),
      userId:user.id,
      loanCategoryId:categoryId,
      amount:amount,
      hasPenalty:loanCategory.hasExpiryFee
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
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        isApproved:null
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
const getUnpaidLoans = async(req,res)=>{
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
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        isApproved:true,
        isPaid:false
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
const getPaidLoans = async(req,res)=>{
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
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        isApproved:true,
        isPaid:false
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
const getApprovedLoans = async(req,res)=>{
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
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        isApproved:true
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
const getRejectedLoans = async(req,res)=>{
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
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']],
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
const getAllLoans = async(req,res)=>{
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
  const loans = await models.loan.findAll(
    {
      order:[['createdAt','DESC']]
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
  let digits = helpers.generateOTP()
  let name = admin.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `LOAN-${digits}${firstDigit}`
  let time = new Date();
  time = time.toLocaleString()
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
  if(loan.isApproved){
    responseData.status = true;
    responseData.message = "loan already aproved";
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
  let amountToBePaid 
  let interestAmount
  if(loanCategory.interestRate){
    let interestRate = parseFloat(loanCategory.interestRate) / 100;
    interestAmount = interestRate * parseInt(loan.amount);
    amountToBePaid = interestAmount + parseInt(loan.amount);
  }else{
    amountToBePaid = parseInt(loanCategory.interestAmount) + parseInt(loan.amount);
  }
  let date = new Date();
  let newDate = new Date(date.setMonth(date.getMonth()+parseInt(loanCategory.maximumDuration)))
  await models.loan.update(
    {
      isApproved:true,
      amountToBePaid:amountToBePaid,
      amoundPaid:0,
      remainingBalance:amountToBePaid,
      isPaid:false,
      dueDate:newDate
    },
    {
      where:{
        id:loanId
      }
    }
  );
  const addon = JSON.stringify({
    amount:loan.amount,
    interestRate: loanCategory.interestRate,
    interestAmount:interestAmount,
    amountToBePaid:amountToBePaid,
    hasExpiryFee:loanCategory.hasExpiryFee,
    expiryFeeAmount:loanCategory.expiryFeeAmount,
    expiryPercentage:loanCategory.expiryPercentage,
    dueDate:date
  })
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"credit",
      message:"loan redeeming",
      beneficiary:"self",
      description:user.firstName + " account funded after loan is approved",
      userId:loan.userId,
      reference:trxRef,
      totalServiceFee:parseInt(loan.amount),
      addon:addon,
      profit:amountToBePaid - parseInt(loan.amount),
      amount:parseInt(loan.amount),
      status:"successful",
      time: time
    }
  );
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:loan.userId
      }
    }
  );
  let walletBalance = parseInt(wallet.accountBalance) + parseInt(loan.amount);
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
  const useDefault = data.useDefault;
  const creditCardId = data.creditCardId
  const amount = parseInt(data.amount);
  let digits = helpers.generateOTP()
  let name = user.firstName;
  let firstDigit = name.substring(0,1);
  let trxRef = `LOAN-${digits}${firstDigit}`
  let time = new Date();
  time = time.toLocaleString()
  const payment = await options.getPayment();
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
  if(loan.isPaid == true){
    responseData.status = false;
    responseData.message = "loan is paid";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(amount > parseInt(loan.amountToBePaid) || amount < 0){
    responseData.status = false;
    responseData.message = "Invalid Amount";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.useWallet){
    return await walletpayment(user,amount,trxRef,time,loan,loanId,res)
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
    const payload = {
      amount : amount,
      email : user.email,
      authorizationCode : creditCard.authCode,
      userId:user.id,
      firstName:user.firstName,
      message:"payment of loan",
      beneficiary:loanId
    }
    await paystackApi.chargeAuthorization(payload,payment)
    responseData.status = 200;
    responseData.message = "payment initiated";
    responseData.data = undefined
    return res.json(responseData);
  }
  if(payment.siteName =='flutterwave'){
    return await walletpayment(user,amount,trxRef,time,loan,loanId,res)
  }
  if(payment.siteName =='monnify'){
    return await walletpayment(user,amount,trxRef,time,loan,loanId,res)
  }
}
const walletpayment = async (user,amount,trxRef,time,loan,loanId,res)=>{
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
        message:"payment of loan by wallet",
        beneficiary:"self",
        description:user.firstName + "paying for loan",
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
  const transaction = await models.transaction.create(
    {
      id:uuid.v4(),
      transactionType:"debit",
      message:"payment of loan",
      beneficiary:"self",
      description:user.firstName + "paying for loan",
      userId:user.id,
      reference:trxRef,
      amount:amount,
      status:"successful",
      time: time
    }
  );
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
  const amoundPaid = parseInt(updatedLoan.amoundPaid);
  const amountToBePaid = parseInt(updatedLoan.amountToBePaid);
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
  responseData.status = 200;
  responseData.message = "payment successful";
  responseData.data = undefined
  return res.json(responseData);
}
module.exports = {
  createLoanCategory,
  changeStatusToFalse,
  changeStatusToTrue,
  editLoanCategory,
  getAllLoanCategories,
  getAllActiveLoanCategories,
  getAllUnactiveLoanCategories,
  getLoanCategory,
  deleteLoanCategory,
  applyForAloan,
  userGetLoans,
  getAppliedLoans,
  getPaidLoans,
  getUnpaidLoans,
  getRejectedLoans,
  getApprovedLoans,
  getAllLoans,
  getAppliedLoan,
  approveALoan,
  disapproveALoan,
  userPayLoan
}