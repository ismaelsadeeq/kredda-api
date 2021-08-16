const models = require('../models');
var request = require('request');
require('dotenv').config();
const uuid = require('uuid');
const converterKey = process.env.FREECONVERTER;
//New Implementation
const responseData = {
	status: true,
	message: "Completed",
	data: null
}


async function validateBvn(payload,paystack){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({
    bvn: payload.bvnNumber,
    first_name: payload.firstName,
    last_name: payload.lastName,
    // middle_name: "Loren"
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/bvn/match',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${privateKey}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data);
      console.log(response);
      if(response.status = true && response.message =="BVN lookup successful"){
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
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function chargeAuthorization(payload,paystack){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const amount = parseFloat(payload.amount) * 100
  const params = JSON.stringify({
    "email": payload.email,
    "amount": amount,
    "authorization_code": payload.authorizationCode
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/charge_authorization',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${privateKey}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      console.log(response);
      if(response.status === true && response.message == "Charge attempted"){
        let time = new Date();
        time = time.toLocaleString()
        const transaction = await models.transaction.create(
          {
            id:uuid.v4(),
            transactionType:"debit",
            message:"funding of wallet",
            beneficiary:"self",
            description:payload.firstName + "funding his/her wallet to perform transaction",
            userId:payload.userId,
            reference:response.data.reference,
            amount:payload.amount,
            isRedemmed:false,
            status:"initiated",
            time: time
          }
        );
        return "charge initiated"
      }
      return "something went wrong"
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function verifyPayment(payload,paystack,respond){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({})
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${payload.reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${privateKey}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      console.log(response);
      if(response.status === true && response.message =="Verification successful"){
        if(response.data.status == "success"){
            const reference = response.data.reference;
            const authorization = response.data.authorization;
            const transaction = await models.transaction.findOne(
              {
                where:{
                  reference:reference,
                  isRedemmed:false
                }
              }
            );
            if(!transaction){
              const wallet = await models.wallet.findOne(
                {
                  where:{
                    userId:payload.userId
                  }
                }
              );
              await models.transaction.update(
                {
                  status:"successful"
                },
                {
                  where:{
                    reference:reference
                  }
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
                  let amount = payload[`NGN_${accountType.currencyCode}`] * (parseFloat(data.data.amount) /100)
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
                const balance = parseFloat(wallet.accountBalance) + (parseFloat(response.data.amount) /100);
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
                    authCode:authorization.authorization_code
                  }
                }
              );
              if(!authCodeExist){
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
                );
              }
              responseData.status = 200;
              responseData.message = "charge successful";
              responseData.data = response
              return respond.json(responseData); 
            }
            responseData.status = 200;
            responseData.message = "charge successful";
            responseData.data = response
            return respond.json(responseData); 
        } else {
          const reference = response.data.reference;
           const wallet = await models.wallet.findOne(
             {
               where:{
                 reference:reference
               }
             }
           );
            const transaction = await models.transaction.findOne(
              {
                where:{
                  reference:reference
                }
              }
            );
            await transaction.update(
              {
                status:"failed"
              },
              {
                where:{
                  reference:reference
                }
              }
            );
            responseData.status = 200;
            responseData.message = "charge failed";
            responseData.data = response
            return respond.json(responseData);
        }
      }
      responseData.status = 200;
      responseData.message = "something went wrong";
      responseData.data = response
      return respond.json(responseData);
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function createCharge(payload,responsee) {
  const userId = payload.id;
  const https = require('https');
  const params = JSON.stringify({
    "email": payload.email, 
    "amount": payload.amount,
    "metadata": {
      "custom_fields": [
        {
          "value": payload.value,
          "display_name": payload.displayName,
          "variable_name":payload.variableName,
        }
      ]
    },
    "bank": {
        "code": payload.bankCode,
        "account_number":payload.accountNumber 
    },
    "birthday": payload.birthday
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req =  https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      let response = JSON.parse(data)
      if(response.status == true && response.data.status == "success"){
        console.log(response);
      }
      console.log(response);
      return responsee.json(response);
    })
  }).on('error',async error => {
    let err = JSON.parse(error);
    console.error(err)
    return responsee.json(err);
  })
  req.write(params)
  req.end()
}
async function createChargeKuda(payload,responsee) {
  const userId = payload.id;
  const https = require('https');
  const params = JSON.stringify({
    "email": payload.email, 
    "amount": payload.amount,
    "metadata": {
      "custom_fields": [
        {
          "value": payload.value,
          "display_name": payload.displayName,
          "variable_name":payload.variableName,
        }
      ]
    },
    "bank": {
      "code": payload.bankCode, 
      "phone": payload.phoneNumber,
      "token": payload.token
    }
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req =  https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      let response = JSON.parse(data)
      if(response.status == true && response.data.status == "success"){
        console.log(response);
        return responsee.json(response);
      }
      console.log(response);
      return responsee.json(response);
    })
  }).on('error',async error => {
    let err = JSON.parse(error);
    console.error(err)
    return responsee.json(err);
  })
  req.write(params)
  req.end()
}
async function submitPin(payload,responsee){
  const https = require('https');
  const params = JSON.stringify({
    "pin": payload.pin,
    "reference": payload.reference
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge/submit_pin',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data);
      console.log(response)
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        
        return responsee.json(response);
      }
      
      return responsee.json(response);
    });
  }).on('error',async error => {
    let err = JSON.parse(error)
    console.error(error)
    return responsee.json(error);
  })
  req.write(params)
  req.end()
}

async function submitOtp(payload,responsee){
  const https = require('https')
  const params = JSON.stringify({
    "otp": payload.otp,
    "reference": payload.reference
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge/submit_otp',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      console.log(response)
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
       
       return responsee.json(response);
     }
     
     return responsee.json(response);
    })
  }).on('error',async error => {
    let err = JSON.parse(error)
    console.error(err)
    return responsee.json(err);
  })
  req.write(params)
  req.end()
}
async function submitPhone(data,responsee){
  const https = require('https')
  const params = JSON.stringify({
    "phone": data.phone,
    "reference": data.reference
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge/submit_phone',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async  () => {
      const response = JSON.parse(data);
      console.log(response)
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        
        return responsee.json(response);
      }
       
      return responsee.json(response);
    })
  }).on('error',async error => {
    let err = JSON.parse(error)
    console.error(err)
    return responsee.json(err);
  })
  req.write(params)
  req.end()
}
async function submitBirthday(data,responsee){
  const https = require('https')
  const params = JSON.stringify({
    "birthday": data.birthday,
    "reference":data.reference
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge/submit_birthday',
    method: 'POST',
    headers: {
      Authorization: `Bearer sk_live_d25de363927993067e7d7d0b7f206b1fd0d87aaa`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      console.log(response)
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
         
        return responsee.json(response);
      }
      return responsee.json(response);
    })
  }).on('error',async error => {
    let err = JSON.parse(error)
    console.error(err)
    return responsee.json(err);
  })
  req.write(params)
  req.end()
}

async function submitAddress(payload,responsee){
  const https = require('https')
  const params = JSON.stringify({
    "reference": payload.reference,
    "address":payload.address ,
    "city": payload.city,
    "state": payload.state,
    "zip_code": payload.zip_code
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge/submit_address',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data);
      console.log(response)
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        
       return responsee.json(response);
     }
     
     return responsee.json(response);
    })
  }).on('error',async error => {
    let err = JSON.parse(error)
    console.error(err)
    return responsee.json(err);
  })
  req.write(params)
  req.end()
} 
async function checkPendingCharge(payload,responsee){
  const https = require('https');
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path:  `/charge/:${payload.reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
    }
  }
  https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      console.log(response)
      if(response){
        if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
          
         return responsee.json(response);
       }
       
       return responsee.json(response);
      }
      return responsee.json(response);
    })
  }).on('error', error => {
    console.error(error)
    return responsee.json(error);
  });
}


module.exports = {
  validateBvn,
  chargeAuthorization,
  verifyPayment,
  createCharge,
  createChargeKuda,
  submitPin,
  submitOtp,
  submitPhone,
  submitBirthday,
  submitAddress,
  checkPendingCharge
}