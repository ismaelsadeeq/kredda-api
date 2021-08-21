const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const airtimeTopUp = (payload)=>{
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://mobileairtimeng.com/httpapi/?userid=xxxx&pass=xxxx&network=x&phone=xxxxx&amt=xx&user_ref=xxx&jsn=json`,
    'headers': {
      'Content-Type': 'application/json',
    }

  };
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body)
    
    return payload.json(sol);
  });
}
module.exports = {
  airtimeTopUp
}