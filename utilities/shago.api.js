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
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "QUB",
      "reference": payload.reference
    })

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
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
const airtimePushase =async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "QAB",
      "phone": payload.phoneNumber,
      "amount": payload.amount,
      "vend_type": "VTU ",
      "network": payload.network,
      "request_id": payload.reference
    })

  };
  request(options, async function (error, response) {
    if (error) throw new Error(error);
    const data = JSON.parse(response.body);
    console.log(data);
    let time = new Date();
    time = time.toLocaleString()
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.phoneNumber,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
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

const dataLookup = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "VDA",
      "phone":payload.phoneNumber,
      "network": payload.network
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    const data = JSON.parse(response.body);
    console.log(data);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const dataPurchase = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "BDA",
      "phone": payload.phoneNumber,
      "amount": payload.amount,
      "bundle": payload.bundle,
      "network": payload.network,
      "package": payload.package,
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    let time = new Date();
    time = time.toLocaleString()
    const data = JSON.parse(response.body);
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.phoneNumber,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
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
const electricityMeterVerication = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "AOV",
      "disco": payload.disco,
      "meterNo": payload.meterNo,
      "type": payload.type
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const purchaseElectricity = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "AOB",
      "disco": payload.disco,
      "meterNo": payload.meterNo,
      "type": payload.type,
      "amount": payload.amount,
      "phonenumber":payload.phoneNumber,
      "name": payload.name,
      "address": payload.names,
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.meterNo,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}

const cableLookup = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
        'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "GDS",
      "smartCardNo": payload.smartCard,
      "type": payload.type
    })
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const purchaseDstvNoAddOn = async (payload,res)=>{
  var request = require('request');
  console.log(payload.packageName);
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "GDB ",
      "smartCardNo": payload.cardNo,
      "customerName": payload.customerName,
      "type": "DSTV ",
      "amount": payload.amount,
      "packagename":payload.packageName,
      "productsCode": payload.packageCode,
      "period": payload.period,
      "hasAddon": "0",
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.cardNo,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "completed";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData);
  });
}
const getDstvAddOns = async (res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'https://shagopayments.com/api/dstv/addon',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "product_code": "COMPE36"
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const purchaseDstvWithAddOn = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "GDB ",
      "smartCardNo": payload.cardNo,
      "customerName": payload.customerName,
      "type": "DSTV ",
      "amount": payload.amount,
      "packagename":payload.packageName,
      "productsCode": payload.packageCode,
      "period": payload.period,
      "period": "1",
      "hasAddon" : "1",
      "addonproductCode" :payload.addOnCode,
      "addonAmount" : payload.addOnAmount,
      "addonproductName" : payload.addOnProductName,
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.cardNo,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
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
const startimesPurchase = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "GDB",
      "smartCardNo":payload.cardNo,
      "type":"STARTIMES",
      "customerName": payload.customerName,
      "packagename": payload.packageName,
      "amount":payload.amount,
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.cardNo,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
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
const goTvPurchase = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': 'c1df88d180d0163fc53f4efde6288a2c87a2ceaaefae0685fd4a8c01b217e70d'
    },
    body: JSON.stringify({
      "serviceCode": "GDB",
      "request_id": payload.reference,
      "amount": payload.aount,
      "type": "GOTV",
      "smartCardNo": payload.cardNo,
      "customerName": payload.customerName,
      "hasAddon": "0",
      "packagename": payload.packageName,
      "productsCode": payload.packageCode,
      "period": payload.period
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.cardNo,
          time:time,
          status:"pending",
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
    if(data.status == 300){
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
        status:"something went wrong",
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
const cableTvBouquteLookup = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
        'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "TV_PACKAGES",
      "type": payload.type  
    })
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const waecPinLookup = async (res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "WAV"
    })

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const waecPinPurchase = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "WAP",
      "numberOfPin":payload.numberOfPin,
      "amount": payload.amount,
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.status == 200){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.numberOfPin,
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.numberOfPin,
          time:time,
          status:"pending",
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
    if(data.status == 300){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.numberOfPin,
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
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.numberOfPin,
        time:time,
        status:"something went wrong",
        totalServiceFee:payload.totalServiceFee,
        profit:payload.profit
      }
    );
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = data;
    return res.json(responseData)
  });
}
const jambLookup = async (res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
        'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "JMO"
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const jambProfileVerificaion = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "JMV",
      "type": payload.type,
      "profileCode": payload.profileCode
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    if(data.status == 200){
      return res.json(data);
    }
    res.statusCode = 200;
    responseData.message = "something went wrong";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  });
}
const jambPinPurchase = async (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': `${process.env.SHAGO_KEY}`
    },
    body: JSON.stringify({
      "serviceCode": "JMB",
      "type": payload.type,
      "profileCode": payload.profileCode,
      "amount": payload.amount,
      "request_id": payload.reference
    })
  
  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const data = JSON.parse(response.body);
    let time = new Date();
    time = time.toLocaleString()
    if(data.status == 200){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.profileCode,
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
    if(data.status == 400){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.profileCode,
          time:time,
          status:"pending",
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
    if(data.status == 300){
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          beneficiary:payload.profileCode,
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
    }
    const  createTransaction = await models.serviceTransaction.create(
      {
        id:uuid.v4(),
        userId:payload.userId,
        serviceId:payload.serviceId,
        reference:payload.reference,
        amount:payload.amount,
        beneficiary:payload.profileCode,
        time:time,
        status:"something went wrong",
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
  airtimePushase,
  dataLookup,
  dataPurchase,
  electricityMeterVerication,
  purchaseElectricity,
  cableLookup,
  cableTvBouquteLookup,
  getDstvAddOns,
  purchaseDstvNoAddOn,
  purchaseDstvWithAddOn,
  startimesPurchase,
  goTvPurchase,
  waecPinLookup,
  waecPinPurchase,
  jambLookup,
  jambProfileVerificaion,
  jambPinPurchase
}