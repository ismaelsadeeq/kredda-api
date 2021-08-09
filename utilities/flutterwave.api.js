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
      'Authorization': `Bearer {{${privateKey}}}`
    }
  };
  request(options, async function (error, response) { 
    if (error) throw new Error(error);
    let response = response.body;
    if(response.status=="status" && response.message =="BVN details fetched"){
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
module.exports = {
  validateBvn
}