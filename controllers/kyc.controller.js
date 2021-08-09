
const models = require('../models');

require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const getAllKyc = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    let pageLimit = parseInt(req.query.pageLimit);
    let currentPage = parseInt(req.query.currentPage);
    let	skip = currentPage * pageLimit;
    const kyc = await models.kyc.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
      }
    );
    if(!kyc){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = kyc;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getAllUnverified = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    let pageLimit = parseInt(req.query.pageLimit);
    let currentPage = parseInt(req.query.currentPage);
    let	skip = currentPage * pageLimit;
    const kyc = await models.kyc.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          status:false
        }
      }
    );
    if(!kyc){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = kyc;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getKyc = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    let id = req.params.id;
    const kyc = await models.kyc.findOne(
      {
        where:{
          id:id
        }
      }
    );
    if(!kyc){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = kyc;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized')
}
const getUserKyc = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    let userId = req.params.userId;
    const kyc = await models.kyc.findOne(
      {
        where:{
          userId:userId
        }
      }
    );
    if(!kyc){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = kyc;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized')
}
const verifyKyc = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    let id = req.params.id;
      await models.kyc.update(
      {
        status:true
      },
      {
        where:{
          id:id
        }
      }
    );
    const kyc = await models.kyc.findOne(
      {
        where:{
          id:id
        }
      }
    );
    const user = await models.user.findOne(
      {
        where:{
          id:kyc.userId
        }
      }
    );
    if(user.profilePicture && kyc.isBvnVerified){
      await models.kyc.update(
        {
          kycLevel:'2'
        },
        {
          where:{
            id:id
          }
        }
      );
    }
    if(!kyc){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "kyc verified";
    responseData.data = kyc;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const unVerifyKyc = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    let id = req.params.id;
    const kyc = await models.kyc.update(
      {
        status:false,
        kycLevel:"1"
      },
      {
        where:{
          id:id
        }
      }
    );
    if(!kyc){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = kyc;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
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
  getAllKyc,
  getAllUnverified,
  getKyc,
  getUserKyc,
  verifyKyc,
  unVerifyKyc
}