const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const webhook =async (req,res)=>{
  //validate event
  let hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  console.log(hash);
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    let data = req.body;
 
    //fund successfull
    if(data.event === "charge.success"){
      const reference = data.data.reference;
      const transaction = await models.transaction.findOne(
        {
          where:{
            reference:reference
          }
        }
      );
      const wallet = await models.wallet.findOne(
        {
          where:{
            userId:transaction.userId
          }
        }
      );
      await transaction.update(
        {
          status:"successful",
        },
        {
          where:{
            reference:reference
          }
        }
      );
      const balance = parseFloat(wallet.accountBalance) + (parseFloat(data.data.amount) /100) ;
      await models.wallet.update(
        {
          accountBalance:balance
        },
        {
          where:{
            id:wallet.id
          }
        }
      );
      const authorization = data.data.authorization
      const authCodeExist = await models.creditCard.findOne(
        {
          where:{
            authorizationCode:authorization.authorization_code
          }
        }
      );
      if(authCodeExist){
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = undefined;
        return res.json(responseData)
      }
      const cardExist = await models.creditCard.findOne(
        {
          where:{
            lastDigits:authorization.last4,
            expMonth:authorization.exp_month,
            expYear:authorization.exp_year
          }
        }
      );
      if(cardExist){
        const createCard = await models.creditCard.update(
          {
            authCode:authorization.authorization_code,
          },{
            where:{
              id:cardExist.id
            }
          }
        )
      }else{
        const createCard = await models.creditCard.create(
          {
            id:uuid.v4(),
            userId:wallet.userId,
            authorizationCode:authorization.authorization_code,
            cardType:authorization.card_type,
            lastDigits:authorization.last4,
            accountName:authorization.account_name,
            bank:authorization.bank,
            expMonth:authorization.exp_month,
            expYear:authorization.exp_year
          }
        )
      }
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    responseData.message = "Invalid payload";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)
    
  }
  res.statusCode = 401;
	return res.json('unauthorize')
}

module.exports = {

}