require('dotenv').config();
async function smsGlobal(receiverPhone,text){
  let request = require('request');
  var options = {
		'method': 'POST',
		'url': `https://api.smsglobal.com/http-api.php?action=sendsms&user=${process.env.SMS_USER}&password=${process.env.SMS_PASSWORD}&from=${process.env.PHONE_NUMBER}&to=${receiverPhone}&text=${text}`,
		'headers': {
			'Content-Type': 'application/json'
    },
  }
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
	})
}
module.exports ={
  smsGlobal
}