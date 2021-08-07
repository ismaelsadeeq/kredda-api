const smsApi = require('../utilities/sms.api');
const helpers = require('../utilities/helpers');
const mailer = require('../utilities/mailjet');
const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const checker = async (req,res)=>{
  const data = req.body;
  if(!data.phoneNumber){
    responseData.status = false;
    responseData.message = "phone number is required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const phoneNumberExist = await models.user.findOne(
    {
      where:{
        phoneNumber:data.phoneNumber
      }
    }
  );
  if(phoneNumberExist){
    responseData.status = false;
    responseData.message = "user already have an account";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const user = await models.user.create(
    {
      id:uuid.v4(),
      phoneNumber:data.phoneNumber
    }
  );
  let val = helpers.generateOTP()
  await models.otpCode.create(
    {
      userId:user.id,
      code:val
    }
  );
  const msg = "Welcome to Kredda use "+val+" to verify your phone number";
  await smsApi.smsGlobal(data.phoneNumber,msg)
  responseData.status = true;
  responseData.message = "otp sent to phone number";
  responseData.data = data.phoneNumber;
  return res.json(responseData);
}
const checkOtp = async (req,res)=>{
  const data = req.body;
  if(!data.code){
    responseData.status = false;
    responseData.message = "code is required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const otpExist = await models.otpCode.findOne(
    {
      where:{
        code:data.code
      }
    }
  );
  if(!otpExist){
    responseData.status = false;
    responseData.message = "incorrect code";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "otp code verified";
  responseData.data = data.phoneNumber;
  return res.json(responseData);
}
const setPassword = async (req,res)=>{
  const data = req.body;
  if(!data.code){
    responseData.status = false;
    responseData.message = "code required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const codeExist = await models.otpCode.findOne(
    {
      where:{
        code:data.code
      }
    }
  );
  if(!codeExist){
    responseData.status = false;
    responseData.message = "code is incorrect";
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(data.pin !==data.confirmPin){
    responseData.status = false;
    responseData.message = "pin and confirmPin does not match";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const saltRounds = 10 
  const salt = bcrypt.genSaltSync(saltRounds);

  const hash = bcrypt.hashSync(data.pin, salt);
  const createPin  = await models.user.update(
    {
      password:hash
    },
    {
      where:{
        id:codeExist.userId
      }
    }
  );
  const user = await models.user.findOne(
    {
      where:{
        id:codeExist.userId,
      }
    }
  );
  const jwt_payload ={
    id:user.id,
  }
  const token = jwt.sign(jwt_payload,process.env.SECRET);
  await models.otpCode.destroy(
    {
      where:{
        code:data.code
      }
    }
  );
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = {
    token:token,
    user:user
  };
  return res.json(responseData);
}
const changePassword = async (req,res)=>{
  data = req.body;
  const user = await models.user.findOne(
    {
      where:{id:req.user.id}
    }
  );
  const checkPassword =  bcrypt.compareSync(data.pin, user.password);
  if(checkPassword){
    if(data.newPin === data.confirmPin){
      const saltRounds = 10 
      const salt = bcrypt.genSaltSync(saltRounds);

      const hash = bcrypt.hashSync(data.newPin, salt);
      
      data.newPin = hash
      await models.user.update(
        {
          password:data.newPin
        },
        {
          where:{
            id:req.user.id
          }
        }
      );
      responseData.status = true;
      responseData.message = "pin changed";
      responseData.data = undefined
      return res.json(responseData)
    } else {
      responseData.status = true;
      responseData.message = "pin did not match"
      responseData.data = undefined
      return res.json(responseData)
    }
  } else{
    responseData.status = true;
    responseData.message = "incorrect pin"
    res.json(responseData);
  }
}
const login = async (req,res)=>{
  const data = req.body;
  const email = data.email;
  const phoneNumber = data.phoneNumber;
  let emailExist,phoneNumberExist;
  let user;
  const password = data.pin;
  if(email){
    emailExist = await models.user.findOne(
     {
       where:{email:email}
     }
   );
   user = emailExist
  }
  if(phoneNumber){
    phoneNumberExist = await models.user.findOne(
      {
        where:{phoneNumber:phoneNumber}
      }
    );
    user = phoneNumberExist
  }
  if (emailExist || phoneNumberExist){
    if(!password){
      responseData.message = 'pin is required';
      responseData.status = false;
      return res.json(responseData)
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      responseData.message = 'Incorrect passsword';
      responseData.status = false;
      return res.json(responseData)
    } else {
      let val = helpers.generateOTP()
      await models.otpCode.create(
        {
          id:uuid.v4(),
          userId:user.id,
          code:val
        }
      );
      const summary = `Hello ${user.firstName}, use the code ${val} to login to Kredda Account`;
      let names = user.firstName +" "+ user.lastName
      const htmlPart = `<div>
      <h3> Hello ${names}</h3
      <p>${summary}</p>
    
      <footer></footer>
      <p>This is a noreply email from Kredda.com</p>
      </div>`
        data.variables = {
          "code": val,
          "summary": summary,
          "htmlPart":htmlPart,
          "names": names,
          "body":summary
        }
      data.val = val;
      data.email = user.email;
      await sendEmail(data);
      responseData.status = true,
      responseData.message = "Enter the code sent to your email to login";
      responseData.data = data.email;
      return res.json(responseData);
    }
  } else {
    return res.json('No account found')
  }
}
const enter2FACode = async (req,res)=>{
  const data = req.body;
  if(!data.code){
    responseData.status = false;
    responseData.message = "code required";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const codeExist = await models.otpCode.findOne(
    {
      where:{
        code:data.code
      }
    }
  );
  if(!codeExist){
    responseData.status = false;
    responseData.message = "code is incorrect";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const user = await models.user.findOne(
    {
      where:{
        id:codeExist.userId,
      }
    }
  );
  const jwt_payload ={
    id:user.id,
  }
  const token = jwt.sign(jwt_payload,process.env.SECRET);
  await models.otpCode.destroy(
    {
      where:{
        code:data.code
      }
    }
  );
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = {
    token:token,
    user:user
  };
  return res.json(responseData);
}
const forgetPassword = async (req,res)=>{
  const data = req.body;
  const email = data.email;
  const phoneNumber = data.phoneNumber;
  let emailExist,phoneNumberExist;
  if(email){
     emailExist = await models.user.findOne(
      {
        where:{email:email}
      }
    );
  }
  if(phoneNumber){
     phoneNumberExist = await models.user.findOne(
      {
        where:{phoneNumber:phoneNumber}
      }
    );
  }
  if (emailExist || phoneNumberExist){
    let val = helpers.generateOTP();
    let sendMail,sendMessage;
    if(email){
      const summary = `Hello ${emailExist.firstName}, use the code ${val} to reset your password to Kredda Account`;
      const msg = "Hello "+emailExist.firstName+", we heard you could not login to your  Account. This things happen to even the most careful of us, you should not feel so bad.  In the meantime, use the code "+ val+" to reset your password for your Kredda Account. You should be back into your account in no time. <br/> <br /> <br /> <br /> <small>If you did not request this, you do not have to do anything  </small>";
      let names = emailExist.firstName +" "+ emailExist.lastName
      const htmlPart = `<div>
      <h3> Hello ${names}</h3
      <p>${summary}</p>
    
      <footer></footer>
      <p>This is a noreply email from Kredda.com</p>
      </div>`
        data.variables = {
          "code": val,
          "summary": summary,
          "htmlPart":htmlPart,
          "names": names,
          "body":msg
        }
      data.val = val;
      sendMail = await sendEmail(data);
      await models.otpCode.create(
        {
          id:uuid.v4(), 
          code:val,
          userId:emailExist.id
        }
      );
    }else if(phoneNumber){
      const summary = `Hello ${phoneNumberExist.firstName}, use the code ${val} to reset your password to Kredda Account`;
      sendMessage = await smsApi.smsGlobal(phoneNumber,summary)
      await models.otpCode.create(
        {
          id:uuid.v4(), 
          code:val,
          userId:phoneNumberExist.id
        }
      );
    }

    responseData.message = "Code Sent"
    return res.json(responseData);  
  }else{
    res.json({
      "status":false,
      "message":"No account found"
    })
  }
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
  checker,
  checkOtp,
  setPassword,
  changePassword,
  forgetPassword,
  login,
  enter2FACode
}