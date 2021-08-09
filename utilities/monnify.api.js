const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');
//New Implementation
const responseData = {
	status: true,
	message: "Completed",
	data: null
}


async function validateBvn(payload,monnify){
  let privateKey;
  if(monnify.privateKey){
    privateKey = monnify.privateKey;
  }else{
    privateKey = monnify.testPrivateKey
  }
  var request = require('request');
  var options = {
    'method': 'POST',
     'body':{
      "bvn":payload.bvnNumber,
        "name":`${payload.firstName} ${payload.lastName}`,
        "dateOfBirth": payload.dob,
        "mobileNo": payload.phoneNumber
    },
    'url': ` https://api.monnify.com/api/v1/vas/bvn-details-match`,
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