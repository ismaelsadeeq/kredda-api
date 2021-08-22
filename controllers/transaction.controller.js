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
//Shago
const userNewTransactions = async (req,res)=>{
  
}
const userTransaction = async (req,res)=>{
  
}
const getransaction = async (req,res)=>{
  
}
const getATransactionInfo = async (req,res)=>{
  
}
module.exports = {
  userNewTransactions,
  userTransaction,
  getransaction,
  getATransactionInfo
}