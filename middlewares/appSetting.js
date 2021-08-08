const models = require('../models');

const getPayment = async (req,res)=>{
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

module.exports = {
  getPayment
}