const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const queryTransaction = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://payments.baxipay.com.ng/api/baxipay/superagent/transaction/requery?agentReference=${payload}`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.data.transactionStatus=="success"){
      await models.serviceTransaction.update(
        {
          status:"successful"
        },
        {
          where:{
            reference:payload.reference
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
          reference:payload.reference
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
const purchaseAirtime = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay ​/services​/airtime​/request`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`
    },
    body:{
      agentReference:payload.reference,
      agentId:process.env.AGENT_ID,
      plan:payload.plan,
      service_type:payload.type,
      amount:payload.amount,
      phone:payload.phoneNumber
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.data.transactionStatus=="success"){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.phoneNumber,
          time:time,
          totalServiceFee:payload.totalServiceFee,
          profit:payload.profit
        }
      );
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.phoneNumber,
        time:time,
        status:"failed",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const getDataBundles = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services​/databundle​/bundles`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date': new Date()
    },
    body:{
      service_type:payload.type
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
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
const purchaseData = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay​/services​/databundle​/request`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date':new Date()
    },
    body:{
      agentReference:payload.reference,
      agentId:process.env.AGENT_ID,
      datacode:payload.cCode,
      service_type:payload.type,
      amount:payload.amount,
      phone:payload.phoneNumber
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.phoneNumber,
          time:time,
          totalServiceFee:payload.totalServiceFee,
          profit:payload.profit
        }
      );
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.phoneNumber,
        time:time,
        status:"failed",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const getCableBouquets = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services/multichoice/list`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date': new Date()
    },
    body:{
      service_type:payload.type
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
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
const getCableBouquetsAddOn = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services/multichoice/addons`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date': new Date()
    },
    body:{
      product_code:payload.productCode,
      service_type:payload.type
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
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
const purchaseCableTv = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services/multichoice/request`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date':new Date()
    },
    body:{
      agentReference:payload.reference,
      smartcard_number:payload.cardNo,
      product_monthsPaidFor:payload.productMonthsPaidFor,
      addon_monthsPaidFor:payload.addonMonthsPaidFor,
      addon_code:payload.addonCode,
      agentId:process.env.AGENT_ID,
      product_code:payload.productCode,
      service_type:payload.type,
      total_amount:payload.amount
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.cardNo,
          time:time,
          totalServiceFee:payload.totalServiceFee,
          profit:payload.profit
        }
      );
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.cardNo,
        time:time,
        status:"failed",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const getEpinBundles = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services/epin/bundles`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date': new Date()
    },
    body:{
      service_type:payload.type
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
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
const purchaseWaecDirectPin = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services​/epin​/request`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date':new Date()
    },
    body:{
      agentReference:payload.reference,
      agentId:process.env.AGENT_ID,
      pinValue:payload.pinValue,
      numberOfPins:payload.numberOfPins,
      service_type:payload.type,
      amount:payload.amount
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.phoneNumber,
          time:time,
          totalServiceFee:payload.totalServiceFee,
          profit:payload.profit
        }
      );
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.phoneNumber,
        time:time,
        status:"failed",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const getAvailableElectricityBillers = async (res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services​/electricity​/billers`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
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
const accountVerification = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services/namefinder/query`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`
    },
    body:{
      account_number:payload.meterNo,
      service_type:payload.type
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
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
  var options = {
    'method': 'POST',
    'url': `https://payments.baxipay.com.ng/api/baxipay/services/electricity/request`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date':new Date()
    },
    body:{
      agentReference:payload.reference,
      agentId:process.env.AGENT_ID,
      account_number:payload.meterNo,
      service_type:payload.type,
      amount:payload.amount,
      phone:payload.phoneNumber
    }
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body);
    console.log(data)
    if(data.code ==200 && data.status=="success"){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.meterNo,
          time:time,
          totalServiceFee:payload.totalServiceFee,
          profit:payload.profit
        }
      );
      res.statusCode = 200;
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = data;
      return res.json(responseData)
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.meterNo,
        time:time,
        status:"failed",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
module.exports = {
  queryTransaction,
  purchaseAirtime,
  getDataBundles,
  purchaseData,
  getCableBouquets,
  getCableBouquetsAddOn,
  purchaseCableTv,
  getEpinBundles,
  purchaseWaecDirectPin,
  getAvailableElectricityBillers,
  accountVerification,
  purchaseElectricity
}