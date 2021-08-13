const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
let crypto = require('crypto');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
async function getSecret(){
  const payment = await options.getPayment();
  let privateKey;
  if(payment.privateKey){
    privateKey = payment.privateKey;
  }else{
    privateKey = payment.testPrivateKey
  }
  return privateKey;
}
const webhook =async (req,res)=>{
  //validate event
  let secret = await getSecret();
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
        res.statusCode = 200;
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = undefined;
        return res.json(responseData)
      }
      const createCard = await models.creditCard.create(
        {
          id:uuid.v4(),
          userId:wallet.userId,
          authCode:authorization.authorization_code,
          cardType:authorization.card_type,
          lastDigits:authorization.last4,
          accountName:authorization.account_name,
          bankName:authorization.bank,
          expiryMonth:authorization.exp_month,
          expiryYear:authorization.exp_year
        }
      )
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    res.statusCode = 200;
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
  let secretHash = await getSecret();
  
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
      res.statusCode = 200;
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
        description:user.firstName + " funding his/her wallet to perform transaction",
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
    res.statusCode = 200;
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
      res.statusCode = 200;
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
        description:user.firstName + " funding his/her wallet to perform transaction",
        status:"failed",
        time: new Date()
      }
    );
    res.statusCode = 200;
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
const monnifyWebhook = async (req,res)=>{
  //creating hash object 
  const payload = req.body;
  let sha = crypto.createHash('sha512');
  let secretHash = await getSecret();
  let unHashedValue = `${secretHash}|${payload.paymentReference}|${payload.amountPaid}|${payload.paidOn}|${payload.transactionReference}`;

  let hash = sha.update(unHashedValue, 'utf-8');
  //Creating the hash in the required format
  let genHash = hash.digest('hex');
  if(genHash!==payload.transactionHash){
    res.statusCode = 401;
	  return res.send('Unauthorize');
  }
  const trxRef = payload.transactionReference;
  if(payload.paymentStatus === "PAID" && payload.paymentMethod === "CARD"){
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
      res.statusCode = 200;
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
        amount:payload.paidOn,
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
    const authCodeExist = await models.creditCard.findOne(
      {
        where:{
          authCode:payload.cardDetails.authorizationCode
        }
      }
    );
    if(authCodeExist){
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    const createCard = await models.creditCard.create(
      {
        id:uuid.v4(),
        userId:wallet.userId,
        authCode:payload.cardDetails.authorizationCode,
        cardType:payload.cardDetails.cardType,
        lastDigits:payload.cardDetails.last4,
        expiryMonth:payload.cardDetails.expMonth,
        expiryYear:payload.cardDetails.expYear
      }
    )
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = response;
    return res.json(responseData);
    }
    if(payload.paymentStatus === "PAID" && payload.paymentMethod === "CARD"){
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
        res.statusCode = 200;
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
          description:user.firstName + " funding his/her wallet to perform transaction",
          status:"failed",
          time: new Date()
        }
      );
    res.statusCode = 200;
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
  flutterwaveWebhook,
  monnifyWebhook
}