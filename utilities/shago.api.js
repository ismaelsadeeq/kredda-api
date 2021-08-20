const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const queryTransaction = async (payload)=>{
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
    const data = response.body;
    if(data.status == 200){
      
    }
  });
  let response ={
    "status": "200",
    "message": "transaction successful",
    "amount": "50",
    "date": {
      "date": "2021-07-26 16:24:00.000000",
      "timezone_type": 3,
      "timezone": "UTC"
    },
    "transId": "1627313040372",
    "type": "MTN_VTU",
    "phone": "07035666498"
  }
}
const airtimePushase =async ()=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': 'c1df88d180d0163fc53f4efde6288a2c87a2ceaaefae0685fd4a8c01b217e70d'
    },
    body: JSON.stringify({
      "serviceCode": "QAB",
      "phone": "07035666498",
      "amount": "50",
      "vend_type": "VTU ",
      "network": "MTN",
      "request_id": "666666292206"
    })

  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
  let response = {
    "message": "transaction successful",
    "status": "200",
    "amount": 50,
    "transId": "1595596779728",
    "type": "VTU",
    "date": "2020-07-24 14:19:41",
    "phone": "07035666498"
  }
}

const dataPurchase = async ()=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'http://34.68.51.255/shago/public/api/test/b2b',
    'headers': {
      'Content-Type': 'application/json',
      'hashKey': 'c1df88d180d0163fc53f4efde6288a2c87a2ceaaefae0685fd4a8c01b217e70d'
    },
    body: JSON.stringify({
      "serviceCode": "VDA",
      "phone": "",
      "network": "AIRTEL"
    })
  
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
  let response = {

  }
}