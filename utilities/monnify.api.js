const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');
const converterKey = process.env.FREECONVERTER;
//New Implementation
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
async function validateBvn(payload,monnify){
  let apiKey,privateKey;
  if(monnify.privateKey){
    apiKey = monnify.publicKey
    privateKey = monnify.privateKey;
  }else{
    apiKey = monnify.testPublicKey;
    privateKey = monnify.testPrivateKey;
  }
  const authKey = Buffer.from(apiKey+":"+privateKey).toString('base64');
  var request = require('request');
  var options = {
    'method': 'POST',
     'body':{
      "bvn":payload.bvnNumber,
        "name":`${payload.firstName} ${payload.lastName}`,
        "dateOfBirth": payload.dob,
        "mobileNo": payload.phoneNumber
    },
    'url': ` https://api.monnify.com/api/v1/vas/bvn-details-match`,
    'headers': {
      'Authorization': `Basic ${authKey}`
    }
  };
  request(options, async function (error, data) { 
    if (error) throw new Error(error);
    let response = data.body;
    response = JSON.parse(response)
    if(response.status=="status" && response.message =="BVN details fetched"){
      await models.kyc.update(
        {
          isBvnVerified:true,
          kycLevel:'2'
        },
        {
          where:{
            userId:payload.id
          }
        }
      );
    }
  });
}
async function validatePayment(payload,monnify,res){
  let apiKey,privateKey;
  if(monnify.privateKey){
    apiKey = monnify.publicKey
    privateKey = monnify.privateKey;
  }else{
    apiKey = monnify.testPublicKey;
    privateKey = monnify.testPrivateKey;
  }
  const authKey = Buffer.from(apiKey+":"+privateKey).toString('base64');
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://sandbox.monnify.com/api/v1/merchant/transactions/query?transactionReference=${payload.reference}`,
    'headers': {
      'Authorization': `Basic ${authKey}`
    }
  };
  request(options, async function (error, data) { 
    if (error) throw new Error(error);
    let response = data.body;
    response = JSON.parse(response)
    console.log(response);
    if(response.requestSuccessful==true && response.responseMessage =="success"){
      if(response.responseBody.paymentStatus ==="PAID"){
        const trxRef = response.responseBody.transactionReference;
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
          responseData.data = response;
          return res.json(responseData)
        }
        let time = new Date();
        time = time.toLocaleString()
        await models.transaction.create(
          {
            id:uuid.v4(),
            userId:payload.userId,
            message:"funding of wallet",
            reference:trxRef,
            transactionType:"debit",
            beneficiary:"self",
            isRedemmed:true,
            amount:response.responseBody.amount,
            description:payload.firstName + " funding his/her wallet to perform transaction",
            status:"successful",
            time:time
          }
        );
        const otherAccount = await models.otherAccount.findOne(
          {
            where:{
              userId:payload.userId,
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
            'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${converterKey}`
          };
          request(options, async function (error, resp) { 
            if (error) throw new Error(error);
            let payload = resp.body;
            payload =  JSON.parse(payload);
            console.log(payload);
            let amount = payload[`NGN_${accountType.currencyCode}`] * parseFloat(response.responseBody.amount)
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
                userId:payload.userId,
              }
            }
          );
          const balance = parseFloat(wallet.accountBalance) + parseFloat(response.responseBody.amount,);
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
        res.statusCode = 200;
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = response;
        return res.json(responseData)
      }
    }
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = response;
    return res.json(responseData)
  });
}
async function initiateATransfer(payload,monnify,res){
  let apiKey,privateKey;
  if(monnify.privateKey){
    apiKey = monnify.publicKey
    privateKey = monnify.privateKey;
  }else{
    apiKey = monnify.testPublicKey;
    privateKey = monnify.testPrivateKey;
  }
  let sourceAccountNumber = monnify.accountNumber;
  const authKey = Buffer.from(apiKey+":"+privateKey).toString('base64');
  var request = require('request');
  var options = {
    'url': `https://sandbox.monnify.com/api/v2/disbursements/initiate-transfer`,
    'headers': {
      'Authorization': `Basic ${authKey}`
    },
    'method': 'POST',
    'body':{
      'amount':payload.amount,
      'reference':payload.trxRef,
      'narration':payload.narration,
      'destinationBankCode':payload.bankCode,
      'destinationAccountNumber':payload.accountNumber,
      'currency':'NGN',
      'sourceAccountNumber':sourceAccountNumber,
      'destinationAccountName':payload.name
    },
    json:true
  };
  request(options, async function (error, data) { 
    if (error) throw new Error(error);
    let response = data.body;
    console.log(response);
    let date = new Date();
    date = date.toLocaleString();
    if(response.responseMessage == "Transaction successful"){
      const createTransaction = await models.transaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          transactionType:"debit",
          message:"payment",
          beneficiary:"self",
          description:"wallet fund widthrawal",
          amount:payload.amount,
          time:date,
          status:"pending",
          isRedemmed:false,
          reference:payload.trxRef,
        }
      );
      res.statusCode = 200
      responseData.status = true;
      responseData.message = "widthrawal initiated";
      responseData.data = response;
      return res.json(responseData)
    }
    const createTransaction = await models.transaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        transactionType:"debit",
        message:"payment",
        beneficiary:"self",
        description:"wallet fund widthrawal",
        amount:payload.amount,
        time:date,
        status:"failed",
        isRedemmed:false,
        reference:payload.trxRef,
      }
    );
    res.statusCode = 200
    responseData.status = true;
    responseData.message = "widthrawal failed";
    responseData.data = response;
    return res.json(responseData)
  });
}
async function getTransfer(payload,monnify,res){
  let apiKey,privateKey;
  if(monnify.privateKey){
    apiKey = monnify.publicKey
    privateKey = monnify.privateKey;
  }else{
    apiKey = monnify.testPublicKey;
    privateKey = monnify.testPrivateKey;
  }
  const authKey = Buffer.from(apiKey+":"+privateKey).toString('base64');
  let reference = payload.reference
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://sandbox.monnify.com/api/v2/disbursements/single/summary?reference=${reference}`,
    'headers': {
      'Authorization': `Basic ${authKey}`
    }
  };
  request(options, async function (error, data) { 
    if (error) throw new Error(error);
    let response = data.body;
    response = JSON.parse(response)
    console.log(response);
    if(response.requestSuccessful==true && response.responseMessage=="success"){
      if(response.responseBody.status =="SUCCESS"){
        await models.transaction.update(
          {
            status:"success",
          },
          {
            where:
            {
              reference:response.responseBody.reference
            }
          }
        );
        responseData.status = true;
        responseData.message = "completed";
        responseData.data = response;
        return res.json(responseData)
      }
      await models.transaction.update(
        {
          status:response.data.status,
        },
        {
          where:
          {
            reference:response.responseBody.reference
          }
        }
      )
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = response;
      return res.json(responseData)
    }
    responseData.status = true;
    responseData.message = "something went wrong";
    responseData.data = response;
    return res.json(responseData)
  });
}
module.exports = {
  validateBvn,
  validatePayment,
  initiateATransfer,
  getTransfer
}