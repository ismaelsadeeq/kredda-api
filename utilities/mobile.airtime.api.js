const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const checkTransactionStatus = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://mobileairtimeng.com/httpapi/status?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&transid=${payload.reference}&jsn=json`,
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

const airtimeTopUp = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumer}&amt=${payload.amount}&user_ref=${payload.reference}&jsn=json`,
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
const mtnVTUTopUp = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/mtnevd?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumer}&amt=${payload.amount}&user_ref=${payload.reference}&jsn=json`,
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
const verifyInternationalNumber = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://mobileairtimeng.com/httpapi/globalvtu-conf?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumer}&country=${payload.country}&jsn=json`,
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
const rechargeInternationalNumber = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/globalvtu?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumer}&amt=${payload.amount}&product=${payload.productId}&user_ref=${payload.reference}&jsn=json`,
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

const mtnDataGifting = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/cdatashare?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&network=${payload.network}&phone=${payload.phoneNumer}&datasize=${payload.dataSize}&user_ref=${payload.reference}&jsn=json`,
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
const getDataPricing = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://mobileairtimeng.com/httpapi/get-items?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&service=${payload.network}&jsn=json`,
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
const purchaseWeacDirect = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/waecdirect?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&jsn=json&user_ref=${payload.reference}`,
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
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.beneficiary,
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
        beneficiary:payload.beneficiary,
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
const purchaseNecoDirect = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/neco?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&jsn=json&user_ref=${payload.reference}`,
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
      const  createTransaction = await models.serviceTransaction.create(
        {
          id:uuid.v4(),
          userId:payload.userId,
          serviceId:payload.serviceId,
          reference:payload.reference,
          amount:payload.amount,
          status:"successful",
          beneficiary:payload.beneficiary,
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
        beneficiary:payload.beneficiary,
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
const getCableCustomerInfo = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://mobileairtimeng.com/httpapi/customercheck?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&bill=${payload.type}&smartno=${payload.cardNo}&jsn=json`,
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
const rechargeGoOrDstv = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/multichoice?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumber}&amt=${payload.amount}&smartno=${payload.cardNo}&customer=${payload.customername}&invoice=${payload.invoiceNo}&billtype=${payload.type}&customernumber=${payload.customerNumber}user_ref=${payload.reference}&jsn=json`,
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
const rechargeStartimes = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/startimes?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&phone=${payload.phoneNumber}&amt=${payload.amount}&smartno=${payload.cardNo}&user_ref=${payload.reference}&jsn=json`,
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
const electricityDiscoLookup = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `http://mobileairtimeng.com/httpapi/power-lists?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&jsn=json`,
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
const electricityMeterVerication = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `http://mobileairtimeng.com/httpapi/power-validate?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}&service=${payload.serviceId}&meterno=${payload.meterNo}&jsn=json`,
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
const purchaseElectricity = (payload,res)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `http://mobileairtimeng.com/httpapi/power-pay?userid=${process.env.MOBILE_AIRTIME_PHONENUMBER}&pass=${MOBILE_AIRTIME_KEY}user_ref=${payload.reference}&service=${payload.serviceId}&meterno=${payload.meterNo}&mtype=${payload.type}&amt=${payload.amount}&jsn=json`,
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
  checkTransactionStatus,
  mtnVTUTopUp,
  airtimeTopUp,
  verifyInternationalNumber,
  rechargeInternationalNumber,
  mtnDataGifting,
  getDataPricing,
  purchaseWeacDirect,
  purchaseNecoDirect,
  getCableCustomerInfo,
  rechargeGoOrDstv,
  rechargeStartimes,
  electricityDiscoLookup,
  electricityMeterVerication,
  purchaseElectricity
}