const helpers = require('../utilities/helpers');
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

const createSetting = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!isAdmin){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  const settingExist = await models.appSetting.findOne(
    {
      where:{
        siteName:data.siteName
      }
    }
  );
  if(settingExist){
    responseData.status = false;
    responseData.message = "setting exist";
    responseData.data = undefined;
    return res.json(responseData);
  }
  const createSetting = await models.appSetting.create(
    {
      id:uuid.v4(),
      siteName:data.siteName,
      testPublicKey:data.testPublicKey,
      testPrivateKey:data.testPrivateKey,
      publicKey:data.publicKey,
      privateKey:data.privateKey,
      currency:data.currency || "NGN",
      purpose:data.purpose,
      isActive:false,
      accountNumber:data.accountNumber
    }
  );
  if(createSetting){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = createSetting;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = "something went wrong";
  responseData.data = undefined;
  return res.json(responseData);
}
const editSetting = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!isAdmin){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  const editSetting = await models.appSetting.update(
    {
      siteName:data.siteName,
      testPublicKey:data.testPublicKey,
      testPrivateKey:data.testPrivateKey,
      publicKey:data.publicKey,
      privateKey:data.privateKey,
      currency:data.currency || "NGN",
      purpose:data.purpose,
      accountNumber:data.accountNumber
    },
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(editSetting){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = "something went wrong";
  responseData.data = undefined;
  return res.json(responseData);
}
const deleteSetting = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!isAdmin){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  const deleteSetting = await models.appSetting.destroy(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(deleteSetting){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = "something went wrong";
  responseData.data = undefined;
  return res.json(responseData);
}
const getSettings = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!isAdmin){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  const settings = await models.appSetting.findAll(
    {
      order:[['createdAt','DESC']]
    }
  );
  if(settings){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = settings;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = "something went wrong";
  responseData.data = undefined;
  return res.json(responseData);
}
const getSetting = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!isAdmin){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  const setting = await models.appSetting.findOne(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(setting){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = setting;
    return res.json(responseData);
  }
  responseData.status = false;
  responseData.message = "something went wrong";
  responseData.data = undefined;
  return res.json(responseData);
}
const changeStatusToActive = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(!isAdmin){
    res.statusCode = 401;
    return res.send('Unauthorized');
  }
  const id = req.params.id;
  let settings = await models.appSetting.findAll(
    {
      where:{
        purpose:data.purpose
      }
    }
  );
  for (let i = 0; i < settings.length; i++) {
    await models.appSetting.update(
      {
        isActive:false
      },
      {
        where:{
          id:settings[i].id
        }
      }
    );
  }
  const setStatus = await models.appSetting.update(
    {
      isActive:true
    },
    {
      where:{
        id:id
      }
    }
  );
  responseData.status = true;
  responseData.message = "status changed to true";
  responseData.data = undefined;
  return res.json(responseData);
}
module.exports = {
  createSetting,
  editSetting,
  deleteSetting,
  getSettings,
  getSetting,
  changeStatusToActive
}