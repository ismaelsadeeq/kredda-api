const models = require('../models');
require('dotenv').config();

const getPayment = async ()=>{
  const getway = await models.appSetting.findOne(
    {
      where:{
        purpose:'payment',
        isActive:true,
      }
    }
  );
  return getway;
}
const getDiscount = async (userId,predefinedDiscount)=>{
  const userType = await models.userType.findOne(
    {
      where:{
        userId:userId
      }
    }
  );
  let discountRate ;
  if(!userType){
    discountRate = process.env.DEFAULT_SERVICE_DISCOUNT;
  }else{
    const category = await models.userCategory.findOne(
      {
        where:{
          id:userType.userCategoryId
        }
      }
    );
    discountRate = category.discountRate;
  }
  let rate = parseFloat(discountRate) / 100 ;
  let discount = parseInt(predefinedDiscount * rate);
  return discount
}
module.exports = {
  getPayment,
  getDiscount
}