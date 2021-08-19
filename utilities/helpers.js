require("dotenv").config();
const models = require('../models');
const generateOTP =()=>{
  let value,val;
  value = Math.floor(100000 + Math.random() * 9000000);
  val = value.toString().substring(0, 5);
  return val
}
function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}
const checkLoans = async()=>{
  let currentDate = new Date();
  const loans = await models.loan.findAll(
    {
      where:{
        hasPenalty:true,
        isPaid:false
      }
    }
  );
  if(loans){
    let loanCategory;
    let additionalFee;
    for (let i = 0; i < loans.length; i++) {
      let maximumDate = loans[i].dueDate;
      if(currentDate>maximumDate){
        loanCategory = await models.loanCategory.findOne(
          {
            where:{
              id:loans[i].loanCategoryId
            }
          }
        );
        if(loanCategory.expiryFeeAmount){
          additionalFee = loanCategory.expiryFeeAmount
        }else{
          additionalFee = parseFloat(loanCategory.expiryPercentage) * parseFloat(loans[i].amount)
        }
        await models.loan.update(
          {
            amountToBePaid:parseFloat(loans[i].amountToBePaid) + parseFloat(additionalFee),
            remainingBalance:parseFloat(loans[i].remainingBalance) +  parseFloat(additionalFee)
          },
          {
            where:{
              id:loans[i].id
            }
          }
        );
      }
    }
  }
}
const checkInvestment = async (req,res)=>{
  let currentDate = new Date();
  let investments = await models.investment.findAll(
    {
      where:{
        status:true,
        isRedemmed:false
      }
    }
  );
  if(investments){
    let wallet,user,dueDate;
    for (let i = 0; i < investments.length; i++) {
      dueDate = investments[i].dueDate
      if(currentDate>dueDate){
        user = await models.user.findOne(
          {
            where:{
              id:investments[i].userId
            }
          }
        );
        wallet = await models.wallet.findOne(
          {
            where:{
              userId:user.id
            }
          }
        );
        await models.wallet.update(
          {
            accountBalance:parseFloat(wallet.accountBalance) + parseFloat(investments[i].payout)
          },
          {
            where:{
              userId:user.id
            }
          }
        );
        await models.investment.update(
          {
            isRedemmed:true
          },
          {
            where:{
              id:investments[i].id
            }
          }
        );
      } 
    }
  }
}
module.exports ={
  generateOTP,
  getDifferenceInDays,
  checkLoans
}