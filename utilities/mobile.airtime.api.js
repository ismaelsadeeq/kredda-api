const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
//to be edited
const checkTransactionStatus = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://mobileairtimeng.com/httpapi/status?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&transid=${payload}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      await models.serviceTransaction.update(
        {
          status:"successful"
        },
        {
          where:{
            reference:payload
          }
        }
      );
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    await models.serviceTransaction.update(
      {
        status:"failed"
      },
      {
        where:{
          reference:payload
        }
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}

const airtimeTopUp = async (payload,res)=>{
  var request = require('request');
  let url =`https://mobileairtimeng.com/httpapi/?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumber}&amt=${payload.amount}&user_ref=${payload.reference}&jsn=json`
  var options = {
    'method': 'POST',
    'url': url,

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const mtnVTUTopUp =async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/mtnevd?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumber}&amt=${payload.amount}&user_ref=${payload.reference}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code == 100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const verifyInternationalNumber = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/globalvtu-conf?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumber}&country=${payload.country}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    if(data.response =='OK'){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const rechargeInternationalNumber = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/globalvtu?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumber}&country=${payload.country}&amt=${payload.amount}&product=${payload.productId}&user_ref=${payload.reference}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}

const mtnDataGifting = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/cdatashare?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumber}&datasize=${payload.dataSize}&user_ref=${payload.reference}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const getDataPricing = async (payload,res)=>{
  var request = require('request');
  let url =`https://mobileairtimeng.com/httpapi/get-items?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&service=${payload.network}&jsn=json`
  var options = {
    'method': 'GET',
    'url': url,
    'headers': {
      'Content-Type': 'application/json',
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const mtnDataShare = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/datashare?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumber}&datasize=${payload.dataSize}&user_ref=${payload.reference}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const dataTopUp = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/datatopup.php?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumber}&user_ref=${payload.reference}&amt=${payload.amount}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const purchaseWeacDirect = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/waecdirect?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&jsn=json&user_ref=${payload.reference}`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const purchaseNecoDirect = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/neco?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&jsn=json&user_ref=${payload.reference}`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const getCableCustomerInfo = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://mobileairtimeng.com/httpapi/customercheck?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&bill=${payload.type}&smartno=${payload.cardNo}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const rechargeGoOrDstv = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/multichoice?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumber}&amt=${payload.amount}&smartno=${payload.cardNo}&customer=${payload.customerName}&invoice=${payload.invoiceNo}&billtype=${payload.type}&customernumber=${payload.customerNumber}user_ref=${payload.reference}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const rechargeStartimes = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/startimes?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumber}&amt=${payload.amount}&smartno=${payload.cardNo}&user_ref=${payload.reference}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const electricityDiscoLookup = async (res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `http://mobileairtimeng.com/httpapi/power-lists?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    if(data.response =='OK'){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const electricityMeterVerication = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `http://mobileairtimeng.com/httpapi/power-validate?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&service=${payload.serviceId}&meterno=${payload.meterNo}&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    if(data.response =='OK'){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const purchaseElectricity = async (payload,res)=>{
  var request = require('request');
  let url = `http://mobileairtimeng.com/httpapi/power-pay?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${process.env.MOBILE_AIRTIME_KEY}&user_ref=${payload.reference}&service=${payload.serviceId}&meterno=${payload.meterNo}&mtype=${payload.type}&amt=${payload.amount}&jsn=json`
  var options = {
    'method': 'POST',
    'url': url,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.code ==100){
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
     const userWallet = await models.wallet.findOne(
      {
        where:{
          userId:payload.userId
        }
      }
    );
    let userWalletBalance = parseInt(userWallet.accountBalance);
    await models.wallet.update(
      {
        accountBalance:userWalletBalance + payload.totalAmount
      },
      {
        where:{
          id:userWallet.id
        }
      }
    );
    const createReversedTransaction = await models.reversedTransaction.create(
      {
        id:uuid.v4(),
        transactionId:payload.transactionId,
        transactionType:'Credit',
        amount:payload.amount,
        beneficiary:payload.userId,
        time:time,
        status:"successful",
        totalServiceFee:payload.totalServiceFee,
        addon:payload.addon,
        typeOfReversal:'Service failure'
      }
    );
    res.statusCode = 200;
    responseData.message = "service unavailable";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
module.exports = {
  checkTransactionStatus,
  mtnVTUTopUp,
  airtimeTopUp,
  verifyInternationalNumber,
  rechargeInternationalNumber,
  mtnDataGifting,
  getDataPricing,
  mtnDataShare,
  dataTopUp,
  purchaseWeacDirect,
  purchaseNecoDirect,
  getCableCustomerInfo,
  rechargeGoOrDstv,
  rechargeStartimes,
  electricityDiscoLookup,
  electricityMeterVerication,
  purchaseElectricity
}