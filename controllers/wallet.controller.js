const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const paystackApi = require('../utilities/paystack.api');
let crypto = require('crypto');
var request = require('request');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const apiKey = process.env.FREECONVERTER
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
const getWalletBalance = async(req,res)=>{
  const user = req.user;
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(!wallet){
    responseData.message = "something wrong";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = wallet;
  return res.json(responseData);
}
const updateLoan = async (transaction)=>{
  const loan = await models.loan.findOne(
    {
      where:{
        id:transaction.beneficiary
      }
    }
  );
  await models.loan.update(
    {
      amoundPaid:parseInt(loan.amoundPaid) + parseFloat(transaction.amount),
      remainingBalance:parseInt(loan.remainingBalance) - parseFloat(transaction.amount),
    },
    {
      where:{
        id:loan.id
      }
    }
  );
  const updatedLoan = await models.loan.findOne(
    {
      where:{
        id:loan.id
      }
    }
  );
  const amoundPaid = parseFloat(updatedLoan.amoundPaid);
  const amountToBePaid = parseFloat(updatedLoan.amountToBePaid);
  if( amoundPaid == amountToBePaid ){
    await models.loan.update(
      {
        isPaid:true
      },
      {
        where:{
          id:loan.id
        }
      }
    );
  }
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
      if(transaction.isRedemmed == false){
        if(transaction.message == "payment of loan"){
          await updateLoan(transaction);
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
          res.statusCode = 200;
          responseData.message = "Success";
          responseData.status = true;
          responseData.data = undefined;
          return res.json(responseData)
        }
        const otherAccount = await models.otherAccount.findOne(
          {
            where:{
              userId:transaction.userId,
              status:true
            }
          }
        );
        if(otherAccount){
          const accountType = await models.accountType.findOne(
            {
              where:{
                id:otherAccount.accountTypeId
              }
            }
          );
          var options = {
            'method': 'GET',
            'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
          };
          request(options, async function (error, response) { 
            if (error) throw new Error(error);
            let payload = response.body;
            payload =  JSON.parse(payload);
            // payload =  { NGN_USD: 0.00243 }
            let amount = payload[`NGN_${accountType.currencyCode}`] * (parseFloat(data.data.amount) /100);
            console.log(amount);
            if(accountType.serviceFee){
              let serviceFee  =  payload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee);
              amount =  amount - serviceFee;
            }
            await models.otherAccount.update(
              {
                status:0,
                accountBalance:parseFloat(otherAccount.accountBalance) + amount
              },
              {
                where:{
                  id:otherAccount.id
                }
              }
            )
          });
        } else {
          const wallet = await models.wallet.findOne(
            {
              where:{
                userId:transaction.userId
              }
            }
          );
          const balance = parseFloat(wallet.accountBalance) + (parseFloat(data.data.amount) /100);
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
          userId:transaction.userId,
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
	return res.send('Unauthorize')
}
const flutterwaveWebhook = async (req,res)=>{

  // retrieve the signature from the header
  var hash = req.headers["verif-hash"];
  // Get signature stored as env variable on your server
  let secretHash = await getSecret();
  console.log(secretHash);
  if(!hash) {
    res.statusCode = 401;
	  return res.send('Unauthorize')
  }
  
  // check if signatures match
  if(hash !== secretHash) {
    res.statusCode = 401;
	  return res.send('Unauthorize')
  }
  
  const payload = req.body;
  if(payload.event=="charge.completed" && payload.data.status=="successful"){
    res.statusCode = 200;
    const trxRef = payload.data.flw_ref;
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
          email:payload.data.customer.email
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
    const transactionExist = await models.transaction.findOne(
      {
        where:{
          reference:trxRef
        }
      }
    );
    if(transactionExist){
      const otherAccount = await models.otherAccount.findOne(
        {
          where:{
            userId:transactionExist.userId,
            status:true
          }
        }
      );
      if(otherAccount){
        const accountType = await models.accountType.findOne(
          {
            where:{
              id:otherAccount.accountTypeId
            }
          }
        );
        var options = {
          'method': 'GET',
          'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
        };
        request(options, async function (error, response) { 
          if (error) throw new Error(error);
          let secondPayload = response.body;
          secondPayload =  JSON.parse(secondPayload);
           // secondPayload =  { NGN_USD: 0.00243 }
          console.log(secondPayload);
          let amount = secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(payload.data.amount)
          if(accountType.serviceFee){
            let serviceFee  =  secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee);
            amount =  amount - serviceFee;
          }
          await models.otherAccount.update(
            {
              status:0,
              accountBalance:parseFloat(otherAccount.accountBalance) + amount
            },
            {
              where:{
                id:otherAccount.id
              }
            }
          )
        });
      } else {
        const wallet = await models.wallet.findOne(
          {
            where:{
              userId:transactionExist.userId,
            }
          }
        );
        const balance = parseFloat(wallet.accountBalance) + parseFloat(payload.data.amount);
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
      await models.transaction.update(
        {
          isRedemmed:true,
          status:"successful",
        },
        {
          where:{
            reference:trxRef
          }
        }
      );
    } else {
      let time = new Date();
      time = time.toLocaleString();
      await models.transaction.create(
        {
          id:uuid.v4(),
          userId:user.id,
          message:"funding of wallet",
          transactionType:"debit",
          beneficiary:"self",
          isRedemmed:true,
          reference:trxRef,
          amount:payload.data.amount,
          description:user.firstName + " funding his/her wallet to perform transaction",
          status:"successful",
          time: time
        }
      );
      const otherAccount = await models.otherAccount.findOne(
        {
          where:{
            userId:user.id,
            status:true
          }
        }
      );
      if(otherAccount){
        const accountType = await models.accountType.findOne(
          {
            where:{
              id:otherAccount.accountTypeId
            }
          }
        );
        var options = {
          'method': 'GET',
          'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
        };
        request(options, async function (error, response) { 
          if (error) throw new Error(error);
          let secondPayload = response.body;
          secondPayload =  JSON.parse(secondPayload);
          // secondPayload =  { NGN_USD: 0.00243 }
          console.log(secondPayload);
          let amount = secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(payload.data.amount)
          if(accountType.serviceFee){
            let serviceFee  =  secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee);
            amount =  amount - serviceFee;
          }
          await models.otherAccount.update(
            {
              status:0,
              accountBalance:parseFloat(otherAccount.accountBalance) + amount
            },
            {
              where:{
                id:otherAccount.id
              }
            }
          )
        });
      } else {
        const wallet = await models.wallet.findOne(
          {
            where:{
              userId:user.id,
            }
          }
        );
        const balance = parseFloat(wallet.accountBalance) + parseFloat(payload.data.amount);
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
    }
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
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
    let time = new Date();
    time = time.toLocaleString()
    await models.transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:false,
        amount:payload.data.amount,
        description:user.firstName + " funding his/her wallet to perform transaction",
        status:"failed",
        time: time
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
  console.log(genHash)
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
    if(transaction){
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    const user = await models.user.findOne(
      {
        where:{
          email:payload.customer.email
        }
      }
    );
    let time = new Date();
    time = time.toLocaleString()
    await models.transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:true,
        amount:payload.amountPaid,
        description:payload.firstName + " funding his/her wallet to perform transaction",
        status:"successful",
        time: time
      }
    );
    const otherAccount = await models.otherAccount.findOne(
      {
        where:{
          userId:user.id,
          status:true
        }
      }
    );
    if(otherAccount){
      const accountType = await models.accountType.findOne(
        {
          where:{
            id:otherAccount.accountTypeId
          }
        }
      );
      var options = {
        'method': 'GET',
        'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
      };
      request(options, async function (error, response) { 
        if (error) throw new Error(error);
        let secondPayload = response.body;
        secondPayload =  JSON.parse(secondPayload);
        console.log(secondPayload);
        let amount = secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(payload.amountPaid)
        if(accountType.serviceFee){
          let serviceFee  =  secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee);
          amount =  amount - serviceFee;
        }
        await models.otherAccount.update(
          {
            status:0,
            accountBalance:parseFloat(otherAccount.accountBalance) + amount
          },
          {
            where:{
              id:otherAccount.id
            }
          }
        )
      });
    } else {
      const wallet = await models.wallet.findOne(
        {
          where:{
            userId:user.id,
          }
        }
      );
      const balance = parseFloat(wallet.accountBalance) + parseFloat(payload.amountPaid);
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
    responseData.data = undefined;
    return res.json(responseData);
    }
    if(payload.paymentStatus === "FAILED" && payload.paymentMethod === "CARD"){
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
        await models.transaction.update(
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
      let time = new Date();
      time = time.toLocaleString()
      await models.transaction.create(
        {
          id:uuid.v4(),
          userId:user.id,
          message:"funding of wallet",
          reference:trxRef,
          transactionType:"debit",
          beneficiary:"self",
          isRedemmed:false,
          amount:payload.amountPaid,
          description:user.firstName + " funding his/her wallet to perform transaction",
          status:"failed",
          time: time
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
  getWalletBalance,
  webhook,
  flutterwaveWebhook,
  monnifyWebhook
}