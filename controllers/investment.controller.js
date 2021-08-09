const models = require('../models');

require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createInvestmentPlan = async (req,res)=>{
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
        const createInvestment = await models.investmentCategory.create(
          {
            id:uuid.v4(),
            name:data.name,
            type:data.type,
            organization:data.organization,
            interestRate:data.interestRate,
            period:data.period,
            picture:req.file.path
          }
        );
        if(!createInvestment){
          responseData.status = false;
          responseData.message = "something went wrong";
          responseData.data = undefined;
          return res.json(responseData);
        }
        responseData.status = true;
        responseData.message = "completed";
        responseData.data = createInvestment;
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
const editInvestmentPlan = async (req,res)=>{
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
        const createInvestment = await models.investmentCategory.update(
          {
            name:data.name,
            type:data.type,
            organization:data.organization,
            interestRate:data.interestRate,
            period:data.period,
            picture:req.file.path
          },
          {
            where:{
              id:req.params.index
            }
          }
        );
        if(!createInvestment){
          responseData.status = false;
          responseData.message = "something went wrong";
          responseData.data = undefined;
          return res.json(responseData);
        }
        responseData.status = true;
        responseData.message = "updated";
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
const getAllInvestmentPlan = async (req,res)=>{
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit;
  const investmentPlans = await models.investmentCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit
    }
  );
  if(!investmentPlans){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investmentPlans;
  return res.json(responseData);
}
const getInvestmentPlan = async (req,res)=>{
  const investmentPlan = await models.investmentCategory.findAll(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!investmentPlan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investmentPlan;
  return res.json(responseData);
}
const deleteInvestmentPlan = async (req,res)=>{
  const investmentPlan = await models.investmentCategory.delete(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!investmentPlan){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = investmentPlan;
  return res.json(responseData);
}
module.exports = {
  createInvestmentPlan,
  editInvestmentPlan,
  getAllInvestmentPlan,
  getInvestmentPlan,
  deleteInvestmentPlan
}