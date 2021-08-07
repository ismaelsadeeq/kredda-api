
require('dotenv').config();
const mailjet = require('node-mailjet').connect(process.env.MAILJET_PUBLIC, process.env.MAILJET_PRIVATE);

async function sendMail(to, variables, subject = "Notification from nobaAfrica") {
  let message = variables.body;
  let names = variables.names
  let html = variables.htmlPart
  const mailjet = require ('node-mailjet').connect(process.env.MAILJET_PUBLIC, process.env.MAILJET_PRIVATE)
const request = mailjet.post("send", {'version': 'v3.1'}).request({
		"Messages":[
			{
		  "From": {
			  "Email": "ask4ismailsadiq@gmail.com", //will be changed to kredda
				"Name": "Customer Success"
			},
			"To": [
				{
				 "Email": to,
				"Name": names
			}
			],
			"Subject": subject,
			"TextPart": message,
			"HTMLPart": html
			}
		]
	})
      request
        .then(result => {
          console.log(result.body)
        })
        .catch(err => {
          console.log(err)
        })
}
module.exports = {
  sendMail
}