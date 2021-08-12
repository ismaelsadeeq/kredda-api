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
    if(data.event === "charge.success"){
      const reference = data.data.reference;
      const authorization = data.data.authorization
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
      if(!transaction.isRedemmed){
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
      }
      await transaction.update(
        {
          status:"successful",
          isRedemmed:true,
        },
        {
          where:{
            reference:reference
          }
        }
      );
      const authCodeExist = await models.creditCard.findOne(
        {
          where:{
            authCode:authorization.authorization_code
          }
        }
      );
      if(authCodeExist){
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = undefined;
        return res.json(responseData)
      }
      const createCard = await models.creditCard.create(
        {
          id:uuid.v4(),
          userId:wallet.userId,
          authorizationCode:authorization.authorization_code,
          cardType:authorization.card_type,
          lastDigits:authorization.last4,
          accountName:authorization.account_name,
          bankName:authorization.bank,
          expMonth:authorization.exp_month,
          expYear:authorization.exp_year
        }
      )
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
const flutterwaveWebhook = async (req,res)=>{

  // retrieve the signature from the header
  var hash = req.headers["verif-hash"];
  
  if(!hash) {
    res.statusCode = 401;
	  return res.send('Unauthorize')
  }
  
  // Get signature stored as env variable on your server
  const secretHash = process.env.FlUTTERWAVE_HASH;
  
  // check if signatures match
  if(hash !== secretHash) {
    res.statusCode = 401;
	  return res.send('Unauthorize')
  }
  
  const payload = req.body;
  if(payload.event=="charge.completed" && payload.data.status=="successful"){
    res.statusCode = 200;
    const trxRef = payload.data.tx_ref;
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxRef,
          isRedemmed:true
        }
      }
    );
    const user = await models.user.findOne(
      {
        where:{
          email:payload.customer.email
        }
      }
    );
    if(transaction){
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    await transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:true,
        amount:response.data.amount,
        description:payload.firstName + " funding his/her wallet to perform transaction",
        status:"successful",
        time: new Date()
      }
    );
    const wallet = await models.wallet.findOne(
      {
        where:{
          userId:user.id,
        }
      }
    );
    const balance = parseFloat(wallet.accountBalance) + parseFloat(response.data.amount);
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
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = response;
    return res.json(responseData);
  }
  if(payload.event=="charge.completed" && payload.data.status=="FAILED"){
    res.statusCode = 200;
    const trxRef = payload.data.tx_ref;
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxRef
        }
      }
    );
    const user = await models.user.findOne(
      {
        where:{
          email:payload.customer.email
        }
      }
    );
    if(transaction){
      await transaction.update(
        {
          status:"failed",
          isRedemmed:false
        },
        {
          where:{
            reference:trxRef
          }
        }
      );
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    await transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:false,
        amount:response.data.amount,
        description:payload.firstName + " funding his/her wallet to perform transaction",
        status:"failed",
        time: new Date()
      }
    );
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
  responseData.message = "Invalid Payload";
  responseData.status = true;
  responseData.data = undefined;
  return res.json(responseData);
}
module.exports = {
  webhook,
  flutterwaveWebhook
}