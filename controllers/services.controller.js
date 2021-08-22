const models = require('../models');
const multer = require('multer');
const uuid = require('uuid');
const multerConfig = require('../config/multer');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
//service Category
const createServiceCategory = async (req,res)=>{
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
    return res.send('Unauthorized');
  }
  multerConfig.singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
      return res.json(err);
    } else if(req.body){
      const data = req.body;
      const createServiceCategory = await models.serviceCategory.create(
        {
          id:uuid.v4(),
          name:data.name,
          type:data.type,
          serviceCharge:data.serviceCharge,
          status:true
        }
      );
      req.file ?
      await models.serviceCategory.update(
        {
          logo:req.file.path
        },
        {
          where:{
            id:createServiceCategory.id
          }
        }
      ):null
      if(!createServiceCategory){
        responseData.status = false;
        responseData.message = "something went wrong";
        responseData.data = undefined;
        return res.json(responseData);
      }
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = createServiceCategory;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const changeServiceCategoryStatusToFalse = async (req,res)=>{
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
    return res.send('Unauthorized');
  }
  const data = req.body;
  const serviceCategory = await models.serviceCategory.update(
    {
      status:false
    },
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!serviceCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "status changed to false";
  responseData.data = undefined;
  return res.json(responseData);
  
}
const changeServiceCategoryStatusToTrue = async (req,res)=>{
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
    return res.send('Unauthorized');
  }
  const data = req.body;
  const serviceCategory = await models.serviceCategory.update(
    {
      status:true
    },
    {
      where:{
        id:req.params.id
    }
    }
  );
  if(!serviceCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "status changed to true";
  responseData.data = undefined;
  return res.json(responseData);
}

module.exports = {

}