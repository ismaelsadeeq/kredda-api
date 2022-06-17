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
          serviceCharge:parseInt(data.serviceCharge),
          vat:parseInt(data.vat),
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
const editServiceCategory = async (req,res)=>{
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
  const createServiceCategory = await models.serviceCategory.update(
    {
      name:data.name,
      type:data.type,
      serviceCharge:parseInt(data.serviceCharge),
      vat:parseInt(data.vat)
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

const editServiceCategoryPicture = async (req,res)=>{
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
      req.file ?
      await models.serviceCategory.update(
        {
          logo:req.file.path
        },
        {
          where:{
            id:req.params.id
          }
        }
      ):null
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.status = false;
    responseData.message = "empty post";
    responseData.data = undefined;
    return res.json(responseData);
  })
}
const getAllServiceCategories = async (req,res)=>{
  const serviceCategories = await models.serviceCategory.findAll(
    {
      order:[['createdAt','DESC']]
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
  const serviceCategories = await models.serviceCategory.findAll(
    {
      order:[['createdAt','DESC']],
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
const getAllUnactiveServiceCategories = async (req,res)=>{
  const serviceCategories = await models.serviceCategory.findAll(
    {
      order:[['createdAt','DESC']],
      where:{
        status:false
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
  const serviceCategory = await models.serviceCategory.findOne(
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
  const serviceCategory = await models.serviceCategory.destroy(
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
      const categoryId = req.params.categoryId;
      const service = await models.service.create(
        {
          id:uuid.v4(),
          serviceCategoryId:categoryId,
          name:data.name,
          code:data.code,
          discount:parseInt(data.discount),
          amount:parseInt(data.amount),
          status:true
        }
      );
      req.file ? 
      await models.service.update(
        {
          logo:req.file.path
        },
        {
          where:{
            id:service.id
          }
        }
      ):null
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
const changeStatusToFalse = async (req,res)=>{
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

const changeStatusToTrue = async (req,res)=>{
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
const editService = async (req,res)=>{
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
  if(req.body){
    const data = req.body;
    const categoryId = req.params.categoryId
    const service = await models.service.update(
      {
        name:data.name,
        code:data.code,
        serviceCategoryId:categoryId,
        discount:parseInt(data.discount),
        amount:parseInt(data.amount)
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
  responseData.status = false;
  responseData.message = "empty post";
  responseData.data = undefined;
  return res.json(responseData);
}
const editServicePicture = async (req,res)=>{
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
    } else {
      req.file ?
      await models.service.update(
        {
          logo:req.file.path
        },
        {
          where:{
            id:req.params.id
          }
        }
      ):null
      responseData.status = true;
      responseData.message = "completed";
      responseData.data = undefined;
      return res.json(responseData);
    }
  })
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
  const services = await models.service.findAll(
    {
      order:[['createdAt','DESC']],
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
const getAllUnactiveService = async (req,res)=>{
  const services = await models.service.findAll(
    {
      order:[['createdAt','DESC']],
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
  const service = await models.service.destroy(
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
module.exports = {
  createServiceCategory,
  editServiceCategory,
  editServiceCategoryPicture,
  changeServiceCategoryStatusToFalse,
  changeServiceCategoryStatusToTrue,
  getAllServiceCategories,
  getServiceCategory,
  getAllActiveServiceCategories,
  getAllUnactiveService,
  getAllUnactiveServiceCategories,
  deleteServiceCategory,
  //service
  createService,
  changeStatusToFalse,
  changeStatusToTrue,
  editService,
  editServicePicture,
  getAllServices,
  getAllCategoryServices,
  getAllActiveService,
  getService,
  deleteService
}