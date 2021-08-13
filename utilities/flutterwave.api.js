const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');
//New Implementation
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
async function validateBvn(payload,flutterwave){
  let privateKey;
  if(flutterwave.privateKey){
    privateKey = flutterwave.privateKey;
  }else{
    privateKey = flutterwave.testPrivateKey
  }
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://rave-api-v2.herokuapp.com/v3/kyc/bvns/${payload.bvnNumber}`,
    'headers': {
      'Authorization': `Bearer ${privateKey}`
    }
  };
  request(options, async function (error, response) { 
    if (error) throw new Error(error);
    let payload = response.body;
    payload =  JSON.parse(payload)
    console.log(payload)
    if(payload.status=="status" && payload.message =="BVN details fetched"){
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
async function verifyPayment(payload,flutterwave,res){
  let privateKey;
  if(flutterwave.privateKey){
    privateKey = flutterwave.privateKey;
  }else{
    privateKey = flutterwave.testPrivateKey
  }
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://api.flutterwave.com/v3/transactions/${payload.id}/verify`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${privateKey}`
    }
  };
  request(options,async function (error, data) { 
    if (error) throw new Error(error);
    let response = data.body;
    response =  JSON.parse(response)
    console.log(response)
    if(response.status == "success" && response.message == "Transaction fetched successfully"){
      if(response.data.status=="successful"){
        res.statusCode = 200;
        const trxRef = response.data.tx_ref;
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
            amount:response.data.amount,
            description:payload.firstName + " funding his/her wallet to perform transaction",
            status:"successful",
            time:time
          }
        );
        const otherAccount = await models.otherAccount.findOne(
          {
            where:{
              userId:wallet.userId,
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
            'method': 'POST',
            'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${process.env.FREECONVERTER}`
          };
          request(options, async function (error, response) { 
            if (error) throw new Error(error);
            let payload = response.body;
            payload =  JSON.parse(payload);
            console.log(payload);
            let amount = parseInt(payload.NGN_USD) * (parseFloat(data.data.amount) /100)
            if(accountType.serviceFee){
              let serviceFee  =  parseInt(payload.NGN_USD) * parseFloat(accountType.serviceFee);
              amount =  amount - serviceFee;
            }
            await models.otherAccount.update(
              {
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
        }
        res.statusCode = 200;
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = response;
        return res.json(responseData)
      }
      if(response.data.status=="FAILED"){
        res.statusCode = 200;
        const trxRef = response.data.tx_ref;
        const transaction = await models.transaction.findOne(
          {
            where:{
              reference:trxRef,
              isRedemmed:true
            }
          }
        );
        if(transaction){
          let time = new Date();
          time = time.toLocaleString()
          await transaction.update(
            {
              beneficiary:"self",
              amount:response.data.amount,
              description:payload.firstName + " funding his/her wallet to perform transaction",
              status:"failed",
              time:time
            },
            {
              where:{
                reference:trxRef,
              }
            }
          );
          const wallet = await models.wallet.findOne(
            {
              where:{
                userId:payload.userId,
              }
            }
          );
          const balance = parseFloat(wallet.accountBalance) - parseFloat(response.data.amount);
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
          return res.json(responseData)
        }
        let time = new Date();
        time = time.toLocaleString()
        await transaction.create(
          {
            id:uuid.v4(),
            userId:user.id,
            message:"funding of wallet",
            reference:trxRef,
            transactionType:"debit",
            beneficiary:"self",
            amount:response.data.amount,
            description:payload.firstName + " funding his/her wallet to perform transaction",
            status:"failed",
            time: time
          }
        );
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = response;
        return res.json(responseData)
      }
    }
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = response;
    return res.json(responseData)
  });
}
module.exports = {
  validateBvn,
  verifyPayment
}