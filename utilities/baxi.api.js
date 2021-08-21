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
    'url': `https://payments.baxipay.com.ng/api/baxipay/superagent/transaction/requery?agentReference=${payload.referece}`,
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
      agentId:process.env.agentId,
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
    'url': `https://payments.baxipay.com.ng/api/baxipay​/services​/databundle​/bundles`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization':`Api-key ${process.env.BAXI_KEY}`,
      'Baxi-date':new Date()
    },
    body:{
      agentReference:payload.reference,
      agentId:process.env.agentId,
      datacode:payload.dataCode,
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
module.exports = {
  queryTransaction
}