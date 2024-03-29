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
const flutterwaveApi = require('../utilities/flutterwave.api');

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
      countryCode:data.countryCode,
      phoneNumber:data.countryCode,
      referralCode:referralCode,
      birthday:data.dob
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
  if(data.dob){
    if(!kyc){
      await models.kyc.create(
        {
          id:uuid.v4(),
          userId:user.id,
          dob:data.dob
        }
      )
    }else if(!kyc.dob){
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
    sendEmail(data);
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
const getAccountAdmin = async (req,res)=>{
  const id = req.params.id;
  const account = await models.user.findOne(
    {
      where:{
        id:id
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
const activateAccount = async (req,res)=>{
  const id = req.params.id;
  const user = await models.admin.findOne(
    {
      where:{
        id:req.user.id
      }
    }
  );
  if(user){
    const account = await models.user.update(
      {
        isActive:true
      },
      {
        where:{
          id:id
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
    responseData.data = undefined;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const deactivateAccount = async (req,res)=>{
  const id = req.params.id;
  const user = await models.admin.findOne(
    {
      where:{
        id:req.user.id
      }
    }
  );
  if(user){
    const account = await models.user.update(
      {
        isActive:false
      },
      {
        where:{
          id:id
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
    responseData.data = undefined;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
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
        const kyc = await models.kyc.findOne(
          {
            where:{
              userId:user.id
            }
          }
        );
        if(kyc.status && kyc.isBvnVerified){
          await models.kyc.update(
            {
              kycLevel:'2'
            },
            {
              where:{
                userId:user.id
              }
            }
          );
        }
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
          id:codeExist.userId
        }
      }
    );
    const kycLevel = await models.kyc.create(
      {
        id:uuid.v4(),
        kycLevel:"1",
        userId:codeExist.userId,
      }
    )
    await models.wallet.create(
      {
        id:uuid.v4(),
        userId:codeExist.userId,
        accountBalance:"0.0"
      }
    );
    await models.otpCode.destroy(
      {
        where:{
          code:data.code
        }
      }
    )
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
        const kycExist = await models.kyc.findOne(
          {
          where:{
            userId:user.id
          }
        });
        if(!kycExist){
           await models.kyc.create(
            {
              id:uuid.v4(),
              meansOfIdentification:req.file.path,
              userId:user.id,
              dob:data.dob,
              bvnNumber:data.bvnNumber
            }
          );
        }else{
          await models.kyc.update(
            {
              meansOfIdentification:req.file.path,
              userId:user.id,
              dob:data.dob,
              bvnNumber:data.bvnNumber
            },
            {
              where:{
                userId:user.id
              }
            }
          );
        }
        const kyc = await models.kyc.findOne(
          {
            where:{
              userId:user.id
            }
          }
        );
        if(kyc.bvnNumber){
          if(!kyc.isBvnVerified){
            await models.kyc.update(
              {
                isBvnVerified:true,
              },
              {
                where:{
                  userId:user.id
                }
              }
            );
            if(user.profilePicture && kyc.status ==true){
              await models.kyc.update(
                {
                  kycLevel:'2'
                },
                {
                  where:{
                    userId:user.id
                  }
                }
              );
            }
            // const payment = await getPayment();
            // if(payment.siteName =='paystack'){
            //   let payload = {
            //     bvnNumber:data.bvnNumber,
            //     firstName:user.firstName,
            //     lastName:data.lastName,
            //     id:user.id
            //   }
            //   await paystackApi.validateBvn(payload,payment)
            // }else if(payment.siteName =='flutterwave'){
            //   let payload = {
            //     bvnNumber:data.bvnNumber,
            //     firstName:user.firstName,
            //     lastName:data.lastName,
            //     id:user.id
            //   }
            //   await flutterwaveApi.validateBvn(payload,payment)
            // }else if(payment.siteName =='monnify'){
            //   let payload = {
            //     bvnNumber:data.bvnNumber,
            //     firstName:user.firstName,
            //     lastName:data.lastName,
            //     id:user.id,
            //     dob:kyc.dob,
            //     phoneNumber:payload.phoneNumber
            //   }
            //   await flutterwaveApi.validateBvn(payload,payment)
            // }
          };
        }
        responseData.status = true;
        responseData.message = "completed";
        responseData.data =  {
          file:req.file,
          data:data
        };
        return res.json(responseData)
      }
    }
		responseData.status = false;
		responseData.message = "file not selected";
		responseData.data = undefined;
		return res.json(responseData);
	})
}
const getAllUsers = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const users = await models.user.findAll(
      {
        order:[['createdAt','DESC']]
      }
    );
    if(!users){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = users;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getActiveUsers = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const users = await models.user.findAll(
      {
        order:[['createdAt','DESC']],
        where:{
          isActive:true
        }
      }
    );
    if(!users){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = users;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getUnActiveUsers = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const users = await models.user.findAll(
      {
        order:[['createdAt','DESC']],
        where:{
          isActive:false
        }
      }
    );
    if(!users){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = users;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const userProfile = async (req,res)=>{
  const id = req.params.id;
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(!user){
    res.statusCode = 401;
    res.json('Unauthorize'); 
  }
  const account = await models.user.findOne(
    {
      where:{
        id:id
      }
    }
  );
  const check = await models.userType.findOne(
    {
      where:{
        userId:id
      }
    }
  );
  let category
  let date ;
  if(check){
    category =  await models.userCategory.findOne(
      {
        where:{
          id:check.userCategoryId
        }
      }
    )
    date = new Date(check.dueDate);
    date = date.toLocaleString();
  }
  const kyc = await models.kyc.findOne(
    {
      where:{
        userId:id
      }
    }
  );
  const getBankDetail = await models.bank.findAll({
    where:{
      userId:id
    }
  });

  const wallet = await models.wallet.findOne({
    where:{
      userId:id
    }
  })
  const otherAccounts = await models.otherAccount.findAll({
    where:{
      userId:id
    },
    include:[{model:models.accountType}]
  });
  const saving = await models.saving.findOne({
    where:{
      userId:id
    }
  });
  const loans = await models.loan.findAll({
    where:{
      userId:id
    },
    include:[{model:models.loanCategory}]
  })
  const investments = await models.investment.findAll({
    where:{
      userId:id
    },
    include:[{model:models.investmentCategory}]
  })
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = {account,category,partnershipDueDate:date,kyc,getBankDetail,wallet,otherAccounts,saving,loans,investments};
  return res.json(responseData);
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
  updateKyc,
  getAllUsers,
  getUnActiveUsers,
  getActiveUsers,
  getAccountAdmin,
  activateAccount,
  deactivateAccount,
  userProfile
}