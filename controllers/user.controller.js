const helpers = require('../utilities/helpers');
const models = require('../models');
const mailer = require('../utilities/mailjet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { getPayment } = require('../middlewares/appSetting');
const multer = require('multer');
const multerConfig = require('../config/multer');
const paystackApi = require('../utilities/paystack.api');

require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const updateAccount = async (req,res)=>{
  const data = req.body;
  const user = req.user;
  let referralCode = helpers.generateOTP()
  const updateUser = await models.user.update(
    {
      firstName:data.firstName,
      lastName:data.lastName,
      gender:data.gender,
      email:data.email,
      city:data.city,
      refferalCode:referralCode
    },
    {
      where:{
        id:user.id
      }
    }
  );
  const kyc = await models.kyc.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(!kyc){
    await models.kyc.create(
      {
        id:uuid.v4(),
        userId:user.id,
        dob:data.dob
      }
    )
  }
  if(!kyc.dob){
    await models.kyc.update(
      {
        dob:data.dob
      },{
        where:{
          userId:user.id
        }
      }
    )
  }
  if(data.email){
    let val = helpers.generateOTP();
    let names = data.firstName;
    const msg = "Welcome "+names+", use the code "+ val+" to verify your email";
    const htmlPart = `<div>
    <h3> Hello ${names}</h3
    <p>${msg}</p>

    <footer></footer>
    <p>This is a noreply email from Kredda.com</p>
  </div>`
    data.variables = {
      "names":names,
      "code": val,
      "summary": msg,
      "html":htmlPart,
      "body":msg
    }
    data.val = val
    await models.otpCode.create({id:uuid.v4(),code:val,userId:user.id});
    sendEmail(data)
  }
  const payment = await getPayment();
  if(payment.siteName =='paystack'){
    const wallet = await models.wallet.findOne(
      {
        where:{
          userId:user.id
        }
      }
    );
    if(!wallet){
      const newUser = await models.user.findOne(
        {
          where:{
            id:user.id
          }
        }
      );
      if(!newUser.email){
        responseData.status = false;
        responseData.message = "no email provided";
        responseData.data = undefined;
        return res.json(responseData);
      }
      let payload = {
        email:newUser.email,
        id:user.id
      }
      await paystackApi.createCustomer(payload,payment);
    }
  }
  responseData.status = true;
  responseData.message = "updated";
  responseData.data = undefined;
  return res.json(responseData);
}
const getAccount = async (req,res)=>{
  const user = req.user;
  const account = await models.user.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!account){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = account;
  return res.json(responseData);
}
const deleteAccount = async (req,res)=>{
  const user = req.user;
  const account = await models.user.destroy(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!account){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "user deleted";
  responseData.data = account;
  return res.json(responseData); 
}
const updateProfilePicture = async (req,res)=>{
  multerConfig.singleUpload(req, res, async function(err) {
		if (err instanceof multer.MulterError) {
			return res.json(err.message);
		} else if (err) {
			return res.json(err);
		} else if(req.body){
			if(req.file){
        const user = req.user;
				await models.user.update(
					{
						profilePicture:req.file.path
					},
					{
						where:{
              id:user.id
            }
					}
				);
				responseData.status = true;
				responseData.message = "completed";
				responseData.data = req.file;
				return res.json(responseData)
      }
			responseData.status = false;
			responseData.message = "file not selected";
			responseData.data = undefined;
			return res.json(responseData);
		}	
	})
}
const verifyEmail = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const codeExist = await models.otpCode.findOne(
    {
      where:{
        code:data.code
      }
    }
  );
  if(codeExist){
    const updateUser = await models.user.update(
      {
        emailVerifiedAt:new Date()
      },
      {
        where:{
          id:user.id
        }
      }
    );
    responseData.status = true;
		responseData.message = "email verified";
		responseData.data = undefined;
		return res.json(responseData)
  }
  responseData.status = false;
	responseData.message = "invalid code";
	responseData.data = undefined;
	return res.json(responseData);
}
const updateKyc =  async (req,res)=>{
  multerConfig.singleUpload(req, res, async function(err) {
		if (err instanceof multer.MulterError) {
			return res.json(err.message);
		} else if (err) {
			return res.json(err);
		} else if(req.body){
			if(req.file){
        const user = req.user;
        const data = req.body;
        const kyc = await models.kyc.findOne(
          {
            where:{
              userId:user.id
            }
          }
        );
        if(kyc){
          await models.kyc.update(
            {
              meansOfIdentification:req.file.path,
              userId:user.id,
              dob:data.dob,
              bvnNumber:data.bvnNumber
            },
            {
              where:{
                id:user.id
              }
            }
          );
          responseData.status = true;
          responseData.message = "completed";
          responseData.data = req.file;
          return res.json(responseData)
        }
        await models.kyc.create(
          {
            id:uuid.v4(),
            meansOfIdentification:req.file.path,
            userId:user.id,
            dob:data.dob,
            bvnNumber:data.bvnNumber
          }
        );
        responseData.status = true;
        responseData.message = "completed";
        responseData.data = req.file;
        return res.json(responseData)
      }
			responseData.status = false;
			responseData.message = "file not selected";
			responseData.data = undefined;
			return res.json(responseData);
		}	
	})
}
const sendEmail= (data)=>{
  const sendMail = mailer.sendMail(data.email, data.variables,data.msg)
 if(sendMail){
 return true
 } else{
   return false
 }
}
module.exports = {
  updateProfilePicture,
  deleteAccount,
  getAccount,
  updateAccount,
  verifyEmail,
  updateKyc
}