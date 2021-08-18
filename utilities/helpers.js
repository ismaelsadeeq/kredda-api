require("dotenv").config();
const model
s = require('../models');
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
  const loans = await models.loans.findAll(
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
            amountToBePaid:parseFloat(loans[i].amountToBePaid) + additionalFee,
            remainingBalance:parseFloat(loans[i].remainingBalance) + additionalFee
          },
          {
            where:{
              id:loans[i].isPaid
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