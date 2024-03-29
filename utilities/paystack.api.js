const models = require('../models');
var request = require('request');
require('dotenv').config();
const uuid = require('uuid');
const converterKey = process.env.FREECONVERTER;
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
      const response = JSON.parse(data);;
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
  const amount = parseInt(payload.totalServiceFee) * 100
  const params = JSON.stringify({
    "email": payload.email,
    "amount": amount,
    "authorization_code": payload.authorizationCode
  })
  let message = payload.message;
  let beneficiary = payload.beneficiary
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
      const response = JSON.parse(data);
      if(response.status === true && response.message == "Charge attempted"){
        let time = new Date();
        time = time.toLocaleString()
        const transaction = await models.transaction.create(
          {
            id:uuid.v4(),
            transactionType:"Credit",
            message: message,
            beneficiary:beneficiary ,
            description:payload.firstName + " funding his/her wallet to perform transaction",
            userId:payload.userId,
            reference:response.data.reference,
            amount:payload.amount,
            totalServiceFee:payload.totalServiceFee,
            addon:payload.addons,
            profit:payload.profit,
            status:"pending",
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
      if(response.status === true && response.message =="Verification successful"){
        if(response.data.status == "success"){
            const reference = payload.reference; //response.data.reference
            const authorization = response.data.authorization;
            const transaction = await models.transaction.findOne(
              {
                where:{
                  reference:reference,
                  status:"successful"
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
                  let amount = parseInt(payload[`NGN_${accountType.currencyCode}`] * (parseFloat(data.data.amount) /100))
                  if(accountType.serviceFee){
                    let serviceFee  =  parseInt(payload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee));
                    amount =  amount - serviceFee;
                  }
                  await models.otherAccount.update(
                    {
                      status:0,
                      accountBalance:parseInt(otherAccount.accountBalance) + amount
                    },
                    {
                      where:{
                        id:otherAccount.id
                      }
                    }
                  )
                });
              } else {
                const balance = parseInt(wallet.accountBalance) + (parseInt(response.data.amount) /100);
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
          const transaction = await models.transaction.findOne(
            {
              where:{
                reference:reference
              }
            }
          );
          if(!transaction){
            let time = new Date();
            time = time.toLocaleString()
            await transaction.create(
              {
                id:uuid.v4(),
                userId:user.id,
                message:"funding of wallet",
                reference:trxRef,
                transactionType:"Credit",
                beneficiary:"self",
                amount:parseInt(response.data.amount) /100,
                totalServiceFee:parseInt(response.data.amount) /100,
                profit:0,
                description:"Wallet funding",
                status:"failed",
                time: time
              }
            );
          }
          if(transaction.status ==="successful"){
            let time = new Date();
            time = time.toLocaleString()
            const createReversedTransaction = await models.reversedTransaction.create(
              {
                id:uuid.v4(),
                transactionId:transaction.id,
                transactionType:'Debit',
                amount:transaction.amount,
                beneficiary:transaction.userId,
                time:time,
                status:"successful",
                totalServiceFee:transaction.totalServiceFee,
                typeOfReversal:'Service failure'
              }
            );
            const wallet = await models.wallet.findOne(
              {
                where:{
                  userId:payload.userId,
                }
              }
            );
            const balance = parseInt(wallet.accountBalance) - transaction.totalServiceFee ;
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
            responseData.message = "charge failed";
            responseData.status = true;
            responseData.data = response;
            return res.json(responseData)
          }else if(transaction.status ==="pending"){
            await models.transaction.update(
              {
                status:"failed"
              },
              {
                where:{
                  id:transaction.id
                }
              }
            );
            responseData.message = "charge failed";
            responseData.status = true;
            responseData.data = response;
            return res.json(responseData)
          }
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
async function createCharge(paystack,payload,responsee) {
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const userId = payload.id;
  const https = require('https');
  const params = JSON.stringify({
    "email": payload.email, 
    "amount": parseFloat(payload.amount) * 100,
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
       Authorization: `Bearer ${privateKey}`,
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
       let time = new Date();
        time = time.toLocaleString()
        const transaction = await models.transaction.create(
          {
            id:uuid.v4(),
            transactionType:"Credit",
            message:"funding of wallet",
            beneficiary:"self",
            description:payload.displayName + " attempting to fund his/her wallet to perform transaction",
            userId:userId,
            reference:response.data.reference,
            amount:payload.amount,
            totalServiceFee:payload.amount,
            profit:0,
            status:"initiated",
            time: time
          }
        );
      }
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
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
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
      Authorization: `Bearer ${privateKey}`,
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
        let time = new Date();
        time = time.toLocaleString()
        const transaction = await models.transaction.create(
          {
            id:uuid.v4(),
            transactionType:"debit",
            message:"funding of wallet",
            beneficiary:"self",
            description:payload.displayName + " attempting to fund his/her wallet to perform transaction",
            userId:userId,
            reference:response.data.reference,
            amount:payload.amount,
            totalServiceFee:payload.amount,
            profit:0,
            status:"initiated",
            time: time
          }
        );
        return responsee.json(response);
      };
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
async function submitPin(paystack,payload,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
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
      if(response.status==false){
        return responsee.json(response);
      }
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        await models.transaction.update(
          {
            status:"pending"
          },
          {
            where:{
              reference:payload.reference
            }
          }
        );
        return responsee.json(response);
      }
       await models.transaction.update(
        {
          status:"failed"
        },
        {
          where:{
            reference:payload.reference
          }
        }
      );
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

async function submitOtp(paystack,payload,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({
    "otp": payload.otp,
    "reference": payload.reference
  })
  console.log(privateKey);
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge/submit_otp',
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
      if(response.status==false){
        return responsee.json(response);
      }
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        await models.transaction.update(
          {
            status:"pending"
          },
          {
            where:{
              reference:payload.reference
            }
          }
        );
        return responsee.json(response);
      }
       await models.transaction.update(
        {
          status:"failed"
        },
        {
          where:{
            reference:payload.reference
          }
        }
      );
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
async function submitPhone(paystack,data,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
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
      Authorization: `Bearer ${privateKey}`,
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
      if(response.status==false){
        return responsee.json(response);
      }
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        await models.transaction.update(
          {
            status:"pending"
          },
          {
            where:{
              reference:payload.reference
            }
          }
        );
        return responsee.json(response);
      }
       await models.transaction.update(
        {
          status:"failed"
        },
        {
          where:{
            reference:data.reference
          }
        }
      );
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
async function submitBirthday(paystack,data,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
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
      if(response.status==false){
        return responsee.json(response);
      }
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        await models.transaction.update(
          {
            status:"pending"
          },
          {
            where:{
              reference:payload.reference
            }
          }
        );
        return responsee.json(response);
      }
       await models.transaction.update(
        {
          status:"failed"
        },
        {
          where:{
            reference:data.reference
          }
        }
      );
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

async function submitAddress(paystack,payload,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
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
      if(response.status==false){
        return responsee.json(response);
      }
      if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
        await models.transaction.update(
          {
            status:"pending"
          },
          {
            where:{
              reference:payload.reference
            }
          }
        );
        return responsee.json(response);
      }
       await models.transaction.update(
        {
          status:"failed"
        },
        {
          where:{
            reference:data.reference
          }
        }
      );
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
async function checkPendingCharge(paystack,payload,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({ })
  console.log(privateKey);
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/charge/:${payload.reference}`,
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
      if(response){
        if(response.status==true && response.message =="Charge attempted" && response.data.status=="success"){
          await models.transaction.update(
           {
             status:"pending"
           },
           {
             where:{
               reference:payload.reference
             }
           }
         );
         return responsee.json(response);
       }
        await models.transaction.update(
         {
           status:"failed"
         },
         {
           where:{
             reference:payload.reference
           }
         }
       );
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
async function verifyAccountNumber(paystack,payload,userId,responsee){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https');
  const params = JSON.stringify({})
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/bank/resolve?account_number=${payload.accountNumber}&bank_code=${payload.bankCode}`,
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
      const response = JSON.parse(data);
      if(response.status === true && response.message === "Account number resolved"){
        const updateBankDetail = await models.bank.update(
          {
            isAccountValid:true
          },
          {
            where:{
              userId:userId
            }
          }
        )
        return responsee.json(response)
      }
      const updateBankDetail = await models.bank.update(
        {
          isAccountValid:false
        },
        {
          where:{
            userId:userId
          }
        }
      )
      return responsee.json(response)
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function createATransferReciepient(paystack,payload,userId,respond){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({
     // "type":"nuban",
     "name" : payload.name,
     "account_number": payload.accountNumber,
     "bank_code": payload.bankCode,
     "currency": "NGN"
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transferrecipient',
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
      if(response.status === true && response.message == "Transfer recipient created successfully"){
        const updateBankDetail = await models.bank.update(
          {
            recipientCode:response.data.recipient_code
          },
          {
            where:{
              userId:userId
            }
          }
        )
        responseData.status = true;
        responseData.message = "Reciepient code generated";
        responseData.data = response
        return respond.json(responseData)
      }
      responseData.status = true;
      responseData.message = "something went wrong";
      responseData.data = response
      return respond.json(responseData)
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}

async function initiateATransfer(paystack,payload,userId,respond){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({
    "source": "balance",
    "amount": payload.totalServiceFee,
    "recipient": payload.recipientCode,
    "reason": payload.reason
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transfer',
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
      if(response.status === true){
        let date = new Date();
        date = date.toLocaleString();
        const createTransaction = await models.transaction.create(
          {
            id:uuid.v4(),
            userId:userId,
            transactionType:"debit",
            message:"payment",
            beneficiary:response.data.reference,
            description:"wallet fund widthrawal",
            amount:parseFloat(payload.amount) / 100,
            time:date,
            status:"pending",
            totalServiceFee:parseFloat(payload.totalServiceFee) / 100,
            profit:totalServiceFee - (parseFloat(payload.amount) / 100),
            reference:response.data.transfer_code,
        }
      );
      responseData.status = true;
      responseData.message = "widthrawal initiated";
      responseData.data = response;
      return respond.json(responseData)
    }
      let date = new Date();
      date = date.toLocaleString();
      const createTransaction = await models.transaction.create(
        {
          id:uuid.v4(),
          userId:userId,
          transactionType:"debit",
          message:"payment",
          beneficiary:response.data.reference,
          description:"wallet fund widthrawal",
          amount:parseFloat(payload.amount) / 100,
          time:date,
          status:"failed",
          totalServiceFee:parseFloat(payload.totalServiceFee) / 100,
          profit:payload.totalServiceFee - (parseFloat(payload.amount) / 100),
          reference:response.data.transfer_code,
        }
      )
    }
  );
    responseData.status = false;
    responseData.message = "charge failed";
    responseData.data = response;
    return respond.json(responseData)
  
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function verifyTransfer(paystack,payload,respond){
  let privateKey;
  if(paystack.privateKey){
    privateKey = paystack.privateKey;
  }else{
    privateKey = paystack.testPrivateKey
  }
  const https = require('https')
  const params = JSON.stringify({
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transfer/verify/:${payload.reference}`,
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
      const response = JSON.parse(data);
      if(response.status === true ){
        if(response.data.status==="success"){
          await models.transaction.update(
            {
              status:"successful",
            },
            {
              where:{
                beneficiary:payload.reference
              }
            }
          )
          responseData.status = true;
          responseData.message = "completed";
          responseData.data = response;
          return respond.json(responseData)
        }
        const transaction =  await models.transaction.findOne(
          {
            where:{
              beneficiary:payload.reference
            }
          }
        )
        if(transaction.status ==="successful"){
          let time = new Date();
          time = time.toLocaleString()
          const createReversedTransaction = await models.reversedTransaction.create(
            {
              id:uuid.v4(),
              transactionId:transaction.id,
              transactionType:'Credit',
              amount:transaction.amount,
              beneficiary:transaction.userId,
              time:time,
              status:"successful",
              totalServiceFee:transaction.totalServiceFee,
              typeOfReversal:'Service failure'
            }
          );
          const wallet = await models.wallet.findOne(
            {
              where:{
                userId:transaction.userId
              }
            }
          );
          const balance = parseInt(wallet.accountBalance) + (parseInt(response.data.amount)/100);
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
          responseData.status = true;
          responseData.message = "charge failed";
          responseData.data = response;
          return respond.json(responseData)
        }
        if(transaction.status ==="pending"){
          await models.transaction.update(
            {
              status:"failed",
            },
            {
              where:{
                beneficiary:payload.reference
              }
            }
          )
          responseData.status = false;
          responseData.message = "charge failed";
          responseData.data = response;
          return respond.json(responseData)
        }
      }
      responseData.status = true;
      responseData.message = "something went wrong";
      responseData.data = response;
      return respond.json(responseData)
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
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
  checkPendingCharge,
  verifyAccountNumber,
  createATransferReciepient,
  initiateATransfer,
  verifyTransfer
}