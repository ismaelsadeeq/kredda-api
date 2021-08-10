const models = require('../models');
const multer = require('multer');
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
  if(user){
    multerConfig.singleUpload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.json(err.message);
      } else if (err) {
        return res.json(err);
      } else if(req.body){
        const createServiceCategory = await models.serviceCategory.create(
          {
            id:uuid.v4(),
            name:data.name,
            type:data.type,
            serviceCharge: data.serviceCharge,
            logo: req.file.path,
            status:true
          }
        );
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
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const changeStatusToFalse = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
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
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const changeStatusToTrue = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
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
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const editServiceCategory = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    multerConfig.singleUpload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.json(err.message);
      } else if (err) {
        return res.json(err);
      } else if(req.body){
        const createServiceCategory = await models.serviceCategory.create(
          {
            name:data.name,
            type:data.type,
            serviceCharge: data.serviceCharge,
            logo: req.file.path
          },
          {
            where:{
              id:req.params.id
            }
          }
        );
        if(!createServiceCategory){
          responseData.status = false;
          responseData.message = "something went wrong";
          responseData.data = undefined;
          return res.json(responseData);
        }
        responseData.status = true;
        responseData.message = "service category updated";
        responseData.data = undefined;
        return res.json(responseData);
      }
      responseData.status = false;
      responseData.message = "empty post";
      responseData.data = undefined;
      return res.json(responseData);
    })
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getAllServiceCategories = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const serviceCategories = await models.serviceCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!serviceCategories){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = serviceCategories;
  return res.json(responseData);
}
const getAllActiveServiceCategories = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const serviceCategories = await models.serviceCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        status:true
      }
    }
  );
  if(!serviceCategories){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = serviceCategories;
  return res.json(responseData);
}
const getServiceCategory = async (req,res)=>{
  const serviceCategory = await models.serviceCategory.findAll(
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
  responseData.message = "completed";
  responseData.data = serviceCategory;
  return res.json(responseData);
}
const deleteServiceCategory = async (req,res)=>{
  const serviceCategory = await models.serviceCategory.delete(
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
  responseData.message = "completed";
  responseData.data = serviceCategory;
  return res.json(responseData);
}
// Service
const createService = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    multerConfig.singleUpload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.json(err.message);
      } else if (err) {
        return res.json(err);
      } else if(req.body){
        const data = req.body;
        const categoryId = req.params.categoryId
        const service = await models.service.create(
          {
            id:uuid.v4(),
            serviceCategoryId:req.params.categoryId,
            name:data.name,
            code:data.code,
            discount:data.discount,
            amount:data.amount,
            logo:req.file.path
          }
        );
        if(!service){
          responseData.status = false;
          responseData.message = "something went wrong";
          responseData.data = undefined;
          return res.json(responseData);
        }
        responseData.status = true;
        responseData.message = "completed";
        responseData.data = service;
        return res.json(responseData);
      }
    })
  }    
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const changeStatusToFalse = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const data = req.body;
    const service = await models.service.update(
      {
        status:false
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!createLoan){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = service;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const changeStatusToTrue = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    const data = req.body;
    const service = await models.service.update(
      {
        status:true
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!service){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = service;
    return res.json(responseData);
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const editService = async (req,res)=>{
  const admin = req.user;
  const user = await models.admin.findOne(
    {
      where:{
        id:admin.id
      }
    }
  );
  if(user){
    multerConfig.singleUpload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.json(err.message);
      } else if (err) {
        return res.json(err);
      } else if(req.body){
        const data = req.body;
        const categoryId = req.params.categoryId
        const service = await models.service.create(
          {
            name:data.name,
            code:data.code,
            serviceCategoryId:req.params.categoryId,
            discount:data.discount,
            amount:data.amount,
            logo:req.file.path
          },
          {
            where:{
              id:req.params.id
            }
          }
        );
        if(!service){
          responseData.status = false;
          responseData.message = "something went wrong";
          responseData.data = undefined;
          return res.json(responseData);
        }
        responseData.status = true;
        responseData.message = "completed";
        responseData.data = service;
        return res.json(responseData);
      }
    })
  }
  res.statusCode = 401;
  return res.send('Unauthorized');
}
const getAllServices = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const services = await models.service.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!services){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = services;
  return res.json(responseData);
}
const getAllCategoryServices = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const services = await models.service.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        serviceCategoryId:req.params.categoryId
      }
    }
  );
  if(!services){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = services;
  return res.json(responseData);
}
const getAllActiveService = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const services = await models.service.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{
        status:true
      }
    }
  );
  if(!services){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = services;
  return res.json(responseData);
}
const getService = async (req,res)=>{
  const service = await models.service.findAll(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!service){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = service;
  return res.json(responseData);
}
const deleteService = async (req,res)=>{
  const service = await models.service.delete(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!loanCategory){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = loanCategory;
  return res.json(responseData);
}
module.exports = {
  createServiceCategory,
  editServiceCategory,
  changeStatusToFalse,
  changeStatusToTrue,
  getAllServiceCategories,
  getServiceCategory,
  getAllActiveServiceCategories,
  deleteServiceCategory,
  //service
  createService,
  changeStatusToFalse,
  changeStatusToTrue,
  editService,
  getAllServices,
  getAllCategoryServices,
  getAllActiveService,
  getService,
  deleteService
}