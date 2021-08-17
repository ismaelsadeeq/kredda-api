const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');
const apiKey = process.env.FREECONVERTER;
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
    console.log(response);
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
            'method': 'GET',
            'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
          };
          request(options, async function (error, resp) { 
            if (error) throw new Error(error);
            let payload = resp.body;
            payload =  JSON.parse(payload);
            console.log(payload);
            let amount = payload[`NGN_${accountType.currencyCode}`] * parseFloat(response.data.amount)
            if(accountType.serviceFee){
              let serviceFee  =  payload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee);
              amount  =  amount - serviceFee;
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
          const balance = parseFloat(wallet.accountBalance) + parseFloat(response.data.amount);
          await models.wallet.update(
            {
              status:0,
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
async function initiatePayment(data,flutterwave,responsee){
  let privateKey;
  if(flutterwave.privateKey){
    privateKey = flutterwave.privateKey;
  }else{
    privateKey = flutterwave.testPrivateKey
  }
  var request = require('request');
  var options = {
    'method': 'POST',
    'body':data,
    'url': `https://api.flutterwave.com/v3/charges?type=debit_ng_account`,
    'headers': {
      'Authorization': `Bearer ${privateKey}`
    }
  };
  request(options, async function (error, response) { 
    if (error) throw new Error(error);
    let payload = response.body;
    payload =  JSON.parse(payload)
    console.log(payload)
    if(payload.status ===true &&payload.message=="charge initiated"){
      let time = new Date();
        time = time.toLocaleString()
        const transaction = await models.transaction.create(
          {
            id:uuid.v4(),
            transactionType:"debit",
            message:"funding of wallet",
            beneficiary:"self",
            description:payload.fullname + " attempting to fund his/her wallet to perform transaction",
            userId:userId,
            reference:response.data.flw_ref,
            amount:payload.amount,
            isRedemmed:false,
            status:"initiated",
            time: time
          }
        );
        return responsee.json(payload);
    }
    return responsee.json(payload);
  });
}
async function validateCharge(userId,data,flutterwave,responsee){
  let privateKey;
  if(flutterwave.privateKey){
    privateKey = flutterwave.privateKey;
  }else{
    privateKey = flutterwave.testPrivateKey
  }
  var request = require('request');
  var options = {
    'method': 'POST',
    'body':data,
    'url': `https://api.flutterwave.com/v3/validate-charge`,
    'headers': {
      'Authorization': `Bearer ${privateKey}`
    }
  };
  request(options, async function (error, response) { 
    if (error) throw new Error(error);
    let payload = response.body;
    payload =  JSON.parse(payload)
    console.log(payload)
    if(payload.status==="success"&& payload.message==="Charge initiated"){
      let time = new Date();
      time = time.toLocaleString()
      const transaction = await models.transaction.create(
        {
          id:uuid.v4(),
          transactionType:"debit",
          message:"funding of wallet",
          beneficiary:"self",
          description:data.fullname + " attempting to fund his/her wallet to perform transaction",
          userId:userId,
          reference:payload.data.flw_ref,
          amount:payload.data.amount,
          isRedemmed:false,
          status:"initiated",
          time: time
        }
      );
      return responsee.json(payload);
    }
    return responsee.json(payload);
  });
}
module.exports = {
  validateBvn,
  verifyPayment,
  initiatePayment,
  validateCharge
}