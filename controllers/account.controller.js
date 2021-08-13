const models = require('../models');
const uuid = require('uuid');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createAccountType = async (req,res)=>{
  const user = req.user;

}
const editAccountType = async (req,res)=>{
  const user = req.user;
  
}
const getAllAccountTypes = async (req,res)=>{
  const user = req.user;
  
}
const getAccountType = async (req,res)=>{
  const user = req.user;
  
}
const deleteAccountType = async (req,res)=>{
  const user = req.user;
  
}
const createAccount = async (req,res)=>{
  const user = req.user;
  
}
const fundAccount = async (req,res)=>{
  const user = req.user;
  
}
const getAccounts = async (req,res)=>{
  const user = req.user;
  
}
const getAccount = async (req,res)=>{
  const user = req.user;
  
}
const disableAccount = async (req,res)=>{
  const user = req.user;
  
}
module.exports = {
  createAccountType,
  editAccountType,
  getAllAccountTypes,
  getAccountType,
  deleteAccountType,
  createAccount,
  fundAccount,
  getAccounts,
  getAccount,
  disableAccount
}