const models = require('../models');

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

module.exports = {
  getPayment
}