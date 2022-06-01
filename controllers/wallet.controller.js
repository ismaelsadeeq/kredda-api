const models = require('../models');
const uuid = require('uuid');
const options = require('../middlewares/appSetting');
const helpers = require('../utilities/helpers');
const paystackApi = require('../utilities/paystack.api');
const shagoApi = require('../utilities/shago.api');
const walletHelpers = require('./wallet.helper.controller');
let crypto = require('crypto');
var request = require('request');
require('dotenv').config();
//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const apiKey = process.env.FREECONVERTER
async function getSecret(){
  const payment = await options.getPayment();
  let privateKey;
  if(payment.privateKey){
    privateKey = payment.privateKey;
  }else{
    privateKey = payment.testPrivateKey
  }
  return privateKey;
}

const getWalletBalance = async(req,res)=>{
  const user = req.user;
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  if(!wallet){
    responseData.message = "something wrong";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData);
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = wallet;
  return res.json(responseData);
}
const updateLoan = async (transaction)=>{
  const loan = await models.loan.findOne(
    {
      where:{
        id:transaction.beneficiary
      }
    }
  );
  await models.loan.update(
    {
      amoundPaid:parseInt(loan.amoundPaid) + parseInt(transaction.amount),
      remainingBalance:parseInt(loan.remainingBalance) - parseInt(transaction.amount),
    },
    {
      where:{
        id:loan.id
      }
    }
  );
  const updatedLoan = await models.loan.findOne(
    {
      where:{
        id:loan.id
      }
    }
  );
  const amoundPaid = parseInt(updatedLoan.amoundPaid);
  const amountToBePaid = parseInt(updatedLoan.amountToBePaid);
  if( amoundPaid == amountToBePaid ){
    await models.loan.update(
      {
        isPaid:true
      },
      {
        where:{
          id:loan.id
        }
      }
    );
  }
}
const updateInvestment = async (transaction)=>{
  const investmentPlan = await models.investmentCategory.findOne(
    {
      where:{
        id:transaction.beneficiary
      }
    }
  );
  const createInvestment = await models.investment.update(
    {
      status:true
    },
    {
      where:{
        id:transaction.beneficiary
      }
    }
  );
}
const partnership = async (transaction,res)=>{
  await transaction.update(
    {
      status:"successful"
    },
    {
      where:{
        reference:transaction.reference
      }
    }
  );
  let beneficiary = JSON.parse(transaction.beneficiary);
  const category = await models.userCategory.findOne(
    {
      where:{
        id:beneficiary.category
      }
    }
  );
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let date = new Date();
  date = date.addDays(parseInt(category.period));
  const userType = await models.userType.create(
    {
      id:uuid.v4(),
      userId:beneficiary.userId,
      userCategoryId:category.id,
      dueDate:date
    }
  );
  res.statusCode = 200;
  responseData.message = "Success";
  responseData.status = true;
  responseData.data = undefined;
  return res.json(responseData)
}

const webhook =async (req,res)=>{
  //validate event
  let secret = await getSecret();
  let hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  console.log(hash);
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    let data = req.body;
    if(data.event === "charge.success"){
      const reference = data.data.reference;
      const authorization = data.data.authorization
      const transaction = await models.transaction.findOne(
        {
          where:{
            reference:reference
          }
        }
      );
      if(transaction){
        if(transaction.message == "payment of loan"){
          await updateLoan(transaction);
          await transaction.update(
            {
              status:"successful"
            },
            {
              where:{
                reference:reference
              }
            }
          );
          res.statusCode = 200;
          responseData.message = "Success";
          responseData.status = true;
          responseData.data = undefined;
          return res.json(responseData)
        }
        if(transaction.message =="investment"){
          await updateInvestment(transaction);
          await transaction.update(
            {
              status:"successful"
            },
            {
              where:{
                reference:reference
              }
            }
          );
          res.statusCode = 200;
          responseData.message = "Success";
          responseData.status = true;
          responseData.data = undefined;
          return res.json(responseData)
        }
        if(transaction.message =="airtime purchase"){
          res.statusCode = 200;
          return await walletHelpers.airtimePurchase(transaction,res);
        }
        if(transaction.message =="data purchase" || transaction.message =="mtn data gifting" || transaction.message =="mtn data share"){
          res.statusCode = 200;
          return await walletHelpers.dataPurchase(transaction,res);
        }
        if(transaction.message =="electricity purchase"){
          res.statusCode = 200;
          return await walletHelpers.electricityPurchase(transaction,res);
        }
        if(transaction.message =="waec pin purchase"){
          res.statusCode = 200;
          return await walletHelpers.waecPurchase(transaction,res);
        }
        if(transaction.message =="neco pin purchase"){
          res.statusCode = 200;
          return await walletHelpers.necoPurchase(transaction,res);
        }
        if(transaction.message =="jamb pin purchase"){
          res.statusCode = 200;
          return await walletHelpers.jambPurchase(transaction,res);
        }
        if(transaction.message =="dstv subscription"){
          res.statusCode = 200;
          return await walletHelpers.dstvPurchase(transaction,res);
        }
        if(transaction.message =="dstv subscription with add on"){
          res.statusCode = 200;
          return await walletHelpers.dstvPurchaseWithAddOn(transaction,res);
        }
        if(transaction.message =="startimes subscription"){
          res.statusCode = 200;
          return await walletHelpers.startimesPurchase(transaction,res);
        }
        if(transaction.message =="goTv subscription"){
          res.statusCode = 200;
          return await walletHelpers.goTvPurchase(transaction,res);
        }
        if(transaction.message =="cable purchase"){
          res.statusCode = 200;
          return await walletHelpers.cablePurchase(transaction,res);
        }
        if(transaction.message =="mtn vtu airtime purchase" || transaction.message =="airtime purchase" || transaction.message =="foreign airtime purchase"){
          res.statusCode = 200;
          return await walletHelpers.airtimePurchase(transaction,res);
        }
        if(transaction.message =="partnership"){
          res.statusCode = 200;
          return await partnership(transaction,res);
        }
        const otherAccount = await models.otherAccount.findOne(
          {
            where:{
              userId:transaction.userId,
              status:true
            }
          }
        );
        if(otherAccount){
          const accountType = await models.accountType.findOne(
            {
              where:{
                id:otherAccount.accountTypeId
              }
            }
          );
          var options = {
            'method': 'GET',
            'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
          };
          request(options, async function (error, response) { 
            if (error) throw new Error(error);
            let payload = response.body;
            payload =  JSON.parse(payload);
            let amount = parseInt(payload[`NGN_${accountType.currencyCode}`] * (parseFloat(data.data.amount) /100));
            if(accountType.serviceFee){
              let serviceFee  =  parseInt(payload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee));
              amount =  amount - serviceFee;
            }
            await models.otherAccount.update(
              {
                status:0,
                accountBalance:parseInt(otherAccount.accountBalance) + amount
              },
              {
                where:{
                  id:otherAccount.id
                }
              }
            )
          });
        } else {
          const wallet = await models.wallet.findOne(
            {
              where:{
                userId:transaction.userId
              }
            }
          );
          const balance = parseInt(parseInt(wallet.accountBalance) + (parseFloat(data.data.amount) /100));
          await models.wallet.update(
            {
              accountBalance:balance
            },
            {
              where:{
                id:wallet.id
              }
            }
          );
        }
      }
      await transaction.update(
        {
          status:"successful",
        },
        {
          where:{
            reference:reference
          }
        }
      );
      const authCodeExist = await models.creditCard.findOne(
        {
          where:{
            authCode:authorization.authorization_code
          }
        }
      );
      if(authCodeExist){
        res.statusCode = 200;
        responseData.message = "Success";
        responseData.status = true;
        responseData.data = undefined;
        return res.json(responseData)
      }
      const createCard = await models.creditCard.create(
        {
          id:uuid.v4(),
          userId:transaction.userId,
          authCode:authorization.authorization_code,
          cardType:authorization.card_type,
          lastDigits:authorization.last4,
          accountName:authorization.account_name,
          bankName:authorization.bank,
          expiryMonth:authorization.exp_month,
          expiryYear:authorization.exp_year
        }
      )
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    if(data.event ==="transfer.success"){
      await models.transaction.update(
        {
          status:"successful"
        },
        {
          where:{
            reference:data.data.transfer_code
          }
        }
      );
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    //fund failed
    if(data.event ==="transfer.failed"){
      await models.transaction.update(
        {
          status:"Failed",
        },
        {
          where:{
            reference:data.data.transfer_code
          }
        }
      );
      let time = new Date();
      time = time.toLocaleString();
      const createTransaction = await models.reversedTransaction.create(
        {
          id:uuid.v4(),
          transactionId:transaction.id,
          transactionType:"credit",
          amount:parseFloat(data.data.amount)/100,
          beneficiary:transaction.userId
          time:time,
          status:"successful",
          totalServiceFee:parseFloat(data.data.amount)/100,
          typeOfReversal:'Service Failure'
          reference:data.data.transfer_code
        }
      );
      const wallet = await models.wallet.findOne(
        {
          where:{
            userId:transaction.userId,
          }
        }
      )
      await models.wallet.update(
        {
          accountBalance:parseInt(parseFloat(wallet.accountBalance) + parseFloat(data.data.amount)/100),
        },
        {
          where:{
            userId:transaction.userId,
          }
        }
      )
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    //fund reversed
    if(data.event ==="transfer.reversed"){
      const transaction = await models.transaction.findOne(
        {
          where:{
            reference:data.data.transfer_code
          }
        }
      );
      let checkTrx = transaction.transactionType;
      checkTrx = checkTrx.toLowerCase();
      if(checkTrx ==="credit"){
        if(transaction.status ==="successful"){
          const createTransaction = await models.reversedTransaction.create(
            {
              id:uuid.v4(),
              transactionId:transaction.id,
              transactionType:"debit",
              amount:parseFloat(data.data.amount)/100,
              beneficiary:transaction.userId
              time:time,
              status:"successful",
              totalServiceFee:parseFloat(data.data.amount)/100,
              typeOfReversal:'Service Failure'
              reference:data.data.transfer_code
            }
          );
          const wallet = await models.wallet.findOne(
            {
              where:{
                userId:transaction.userId,
              }
            }
          )
          await models.wallet.update(
            {
              accountBalance:parseInt(parseFloat(wallet.accountBalance) - parseFloat(data.data.amount)/100),
            },
            {
              where:{
                userId:transaction.userId,
              }
            }
          )
        }
      }
      if(checkTrx ==="debit"){
        if(transaction.status ==="successful"){
          const createTransaction = await models.reversedTransaction.create(
            {
              id:uuid.v4(),
              transactionId:transaction.id,
              transactionType:"Credit",
              amount:parseFloat(data.data.amount)/100,
              beneficiary:transaction.userId
              time:time,
              status:"successful",
              totalServiceFee:parseFloat(data.data.amount)/100,
              typeOfReversal:'Service Failure'
              reference:data.data.transfer_code
            }
          );
          const wallet = await models.wallet.findOne(
            {
              where:{
                userId:transaction.userId,
              }
            }
          )
          await models.wallet.update(
            {
              accountBalance:parseInt(parseFloat(wallet.accountBalance) + parseFloat(data.data.amount)/100),
            },
            {
              where:{
                userId:transaction.userId,
              }
            }
          )
        }
      }
      await models.transaction.update(
        {
          status:"Reversed",
          isRedemmed:true
        },
        {
          where:{
            reference:data.data.transfer_code
          }
        }
      );
      const createTransaction = await models.transaction.create(
        {
          id:uuid.v4(),
          userId:transaction.userId,
          transactionType:"credit",
          amount:parseInt(parseInt(data.data.amount)/100),
          time:data.data.recipient.created_at,
          status:"Success",
          reference:data.data.transfer_code
        }
      );
      const wallet = await models.wallet.findOne(
        {
          where:{
            userId:transaction.userId
          }
        }
      );
      const reverse = await models.wallet.update(
        {
          accountBalance:parseInt(parseFloat(wallet.accountBalance) + parseFloat(data.data.amount)/100),
        },
        {
          where:
          {
            userId:transaction.userId
          }
        }
      );
      responseData.message = "Transaction Reversed";
      responseData.status = true;
      responseData.data = null;
      return res.json(responseData)
    }
    res.statusCode = 200;
    responseData.message = "Invalid payload";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)
    
  }
  res.statusCode = 401;
	return res.send('Unauthorize')
}
const flutterwaveWebhook = async (req,res)=>{

  // retrieve the signature from the header
  var hash = req.headers["verif-hash"];
  // Get signature stored as env variable on your server
  let secretHash = await getSecret();
  console.log(secretHash);
  if(!hash) {
    res.statusCode = 401;
	  return res.send('Unauthorize')
  }
  
  // check if signatures match
  if(hash !== secretHash) {
    res.statusCode = 401;
	  return res.send('Unauthorize')
  }
  
  const payload = req.body;
  if(payload.event=="charge.completed" && payload.data.status=="successful"){
    res.statusCode = 200;
    const trxRef = payload.data.flw_ref;
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxRef,
          isRedemmed:true
        }
      }
    );
    const user = await models.user.findOne(
      {
        where:{
          email:payload.data.customer.email
        }
      }
    );
    if(transaction){
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    const transactionExist = await models.transaction.findOne(
      {
        where:{
          reference:trxRef
        }
      }
    );
    if(transactionExist){
      const otherAccount = await models.otherAccount.findOne(
        {
          where:{
            userId:transactionExist.userId,
            status:true
          }
        }
      );
      if(otherAccount){
        const accountType = await models.accountType.findOne(
          {
            where:{
              id:otherAccount.accountTypeId
            }
          }
        );
        var options = {
          'method': 'GET',
          'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
        };
        request(options, async function (error, response) { 
          if (error) throw new Error(error);
          let secondPayload = response.body;
          secondPayload =  JSON.parse(secondPayload);
           // secondPayload =  { NGN_USD: 0.00243 }
          let amount = parseInt(secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(payload.data.amount))
          if(accountType.serviceFee){
            let serviceFee  =  parseInt(secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee));
            amount =  amount - serviceFee;
          }
          await models.otherAccount.update(
            {
              status:0,
              accountBalance:parseInt(otherAccount.accountBalance) + amount
            },
            {
              where:{
                id:otherAccount.id
              }
            }
          )
        });
      } else {
        const wallet = await models.wallet.findOne(
          {
            where:{
              userId:transactionExist.userId,
            }
          }
        );
        const balance = parseInt(wallet.accountBalance) + parseInt(payload.data.amount);
        await models.wallet.update(
          {
            accountBalance:balance
          },
          {
            where:{
              id:wallet.id
            }
          }
        );
      }
      await models.transaction.update(
        {
          isRedemmed:true,
          status:"successful",
        },
        {
          where:{
            reference:trxRef
          }
        }
      );
    } else {
      let time = new Date();
      time = time.toLocaleString();
      await models.transaction.create(
        {
          id:uuid.v4(),
          userId:user.id,
          message:"funding of wallet",
          transactionType:"debit",
          beneficiary:"self",
          isRedemmed:true,
          reference:trxRef,
          amount:parseInt(payload.data.amount),
          description:user.firstName + " funding his/her wallet to perform transaction",
          status:"successful",
          time: time
        }
      );
      const otherAccount = await models.otherAccount.findOne(
        {
          where:{
            userId:user.id,
            status:true
          }
        }
      );
      if(otherAccount){
        const accountType = await models.accountType.findOne(
          {
            where:{
              id:otherAccount.accountTypeId
            }
          }
        );
        var options = {
          'method': 'GET',
          'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
        };
        request(options, async function (error, response) { 
          if (error) throw new Error(error);
          let secondPayload = response.body;
          secondPayload =  JSON.parse(secondPayload);
          // secondPayload =  { NGN_USD: 0.00243 }
          let amount = parseInt(secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(payload.data.amount))
          if(accountType.serviceFee){
            let serviceFee  =  parseInt(secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee));
            amount =  amount - serviceFee;
          }
          await models.otherAccount.update(
            {
              status:0,
              accountBalance:parseInt(otherAccount.accountBalance) + amount
            },
            {
              where:{
                id:otherAccount.id
              }
            }
          )
        });
      } else {
        const wallet = await models.wallet.findOne(
          {
            where:{
              userId:user.id,
            }
          }
        );
        const balance = parseInt(wallet.accountBalance) + parseInt(payload.data.amount);
        await models.wallet.update(
          {
            accountBalance:balance
          },
          {
            where:{
              id:wallet.id
            }
          }
        );
      }
    }
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(payload.event=="charge.completed" && payload.data.status=="FAILED"){
    res.statusCode = 200;
    const trxRef = payload.data.tx_ref;
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxRef
        }
      }
    );
    const user = await models.user.findOne(
      {
        where:{
          email:payload.customer.email
        }
      }
    );
    if(transaction){
      await transaction.update(
        {
          status:"failed",
          isRedemmed:false
        },
        {
          where:{
            reference:trxRef
          }
        }
      );
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    let time = new Date();
    time = time.toLocaleString()
    await models.transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:false,
        amount:parseInt(payload.data.amount),
        description:user.firstName + " funding his/her wallet to perform transaction",
        status:"failed",
        time: time
      }
    );
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(payload.event=="transfer.completed" && payload.data.status =="SUCCESSFUL"){
    await models.transaction.update(
      {
        status:"success",
        isRedemmed:true, 
      },
      {
        where:{
          reference:payload.data.reference
        }
      }
    );
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(payload.event=="transfer.completed" && payload.data.status =="FAILED"){
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:payload.data.reference
        }
      }
    );
    await models.transaction.update(
      {
        status:"Failed",
        isRedemmed:true
      },
      {
        where:{
          reference:payload.data.reference
        }
      }
    );
    let reference = helpers.generateOTP()+"renew" ;
    const createTransaction = await models.transaction.create(
      {
        id:uuid.v4(),
        userId:transaction.userId,
        transactionType:"credit",
        amount:parseInt(payload.data.amount),
        time:payload.data.created_at,
        status:"Success",
        reference:reference
      }
    );
    const wallet = await models.wallet.findOne(
      {
        where:{
          userId:transaction.userId
        }
      }
    )
    await models.wallet.update(
      {
        accountBalance:parseInt(wallet.accountBalance) + parseInt(payload.data.amount),
      },
      {
        where:{
          userId:transaction.userId,
        }
      }
    )
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
  responseData.message = "Invalid Payload";
  responseData.status = true;
  responseData.data = undefined;
  return res.json(responseData);
}
const monnifyWebhook = async (req,res)=>{
  //creating hash object 
  const payload = req.body;
  let sha = crypto.createHash('sha512');
  let secretHash = await getSecret();
  let unHashedValue = `${secretHash}|${payload.paymentReference}|${payload.amountPaid}|${payload.paidOn}|${payload.transactionReference}`;

  let hash = sha.update(unHashedValue, 'utf-8');
  //Creating the hash in the required format
  let genHash = hash.digest('hex');
  console.log(genHash)
  if(genHash!==payload.transactionHash){
    res.statusCode = 401;
	  return res.send('Unauthorize');
  }
  const trxRef = payload.transactionReference;
  if(payload.paymentStatus === "PAID" && payload.paymentMethod === "CARD"){
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxRef,
          isRedemmed:true
        }
      }
    );
    if(transaction){
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    const user = await models.user.findOne(
      {
        where:{
          email:payload.customer.email
        }
      }
    );
    let time = new Date();
    time = time.toLocaleString()
    await models.transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:true,
        amount:parseInt(payload.amountPaid),
        description:payload.firstName + " funding his/her wallet to perform transaction",
        status:"successful",
        time: time
      }
    );
    const otherAccount = await models.otherAccount.findOne(
      {
        where:{
          userId:user.id,
          status:true
        }
      }
    );
    if(otherAccount){
      const accountType = await models.accountType.findOne(
        {
          where:{
            id:otherAccount.accountTypeId
          }
        }
      );
      var options = {
        'method': 'GET',
        'url': `https://free.currconv.com/api/v7/convert?q=NGN_${accountType.currencyCode}&compact=ultra&apiKey=${apiKey}`
      };
      request(options, async function (error, response) { 
        if (error) throw new Error(error);
        let secondPayload = response.body;
        secondPayload =  JSON.parse(secondPayload);
        let amount = parseInt(secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(payload.amountPaid))
        if(accountType.serviceFee){
          let serviceFee  =  parseInt(secondPayload[`NGN_${accountType.currencyCode}`] * parseFloat(accountType.serviceFee));
          amount =  amount - serviceFee;
        }
        await models.otherAccount.update(
          {
            status:0,
            accountBalance:parseFloat(otherAccount.accountBalance) + amount
          },
          {
            where:{
              id:otherAccount.id
            }
          }
        )
      });
    } else {
      const wallet = await models.wallet.findOne(
        {
          where:{
            userId:user.id,
          }
        }
      );
      const balance = parseInt(wallet.accountBalance) + parseInt(payload.amountPaid);
      await models.wallet.update(
        {
          accountBalance:balance
        },
        {
          where:{
            id:wallet.id
          }
        }
      );
    }
    const authCodeExist = await models.creditCard.findOne(
      {
        where:{
          authCode:payload.cardDetails.authorizationCode
        }
      }
    );
    if(authCodeExist){
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    const createCard = await models.creditCard.create(
      {
        id:uuid.v4(),
        userId:wallet.userId,
        authCode:payload.cardDetails.authorizationCode,
        cardType:payload.cardDetails.cardType,
        lastDigits:payload.cardDetails.last4,
        expiryMonth:payload.cardDetails.expMonth,
        expiryYear:payload.cardDetails.expYear
      }
    )
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData);
  }
  if(payload.paymentStatus === "FAILED" && payload.paymentMethod === "CARD"){
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxRef
        }
      }
    );
    const user = await models.user.findOne(
      {
        where:{
          email:payload.customer.email
        }
      }
    );
    if(transaction){
      await models.transaction.update(
        {
          status:"failed",
          isRedemmed:false
        },
        {
          where:{
            reference:trxRef
          }
        }
      );
      res.statusCode = 200;
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData)
    }
    let time = new Date();
    time = time.toLocaleString()
    await models.transaction.create(
      {
        id:uuid.v4(),
        userId:user.id,
        message:"funding of wallet",
        reference:trxRef,
        transactionType:"debit",
        beneficiary:"self",
        isRedemmed:false,
        amount:parseInt(payload.amountPaid),
        description:user.firstName + " funding his/her wallet to perform transaction",
        status:"failed",
        time: time
      }
    );
    res.statusCode = 200;
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
  responseData.message = "Invalid Payload";
  responseData.status = true;
  responseData.data = undefined;
  return res.json(responseData);
}
const monnifyEventWebhook = async (req,res)=>{
  const payload = req.body;
  if(payload.eventType =="SUCCESSFUL_DISBURSEMENT" && payload.eventData.status =="SUCCESS"){
    let trxReference = payload.eventData.reference;
    await models.transaction.update(
      {
        status:"success",
        isRedemmed:true, 
      },
      {
        where:{
          reference:trxReference
        }
      }
    );
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
  if(payload.eventType =="FAILED_DISBURSEMENT" && payload.eventData.status =="FAILED"){
    let trxReference = payload.eventData.reference;
    const transaction = await models.transaction.findOne(
      {
        where:{
          reference:trxReference
        }
      }
    );
    await models.transaction.update(
      {
        status:"Failed",
        isRedemmed:true
      },
      {
        where:{
          reference:trxReference
        }
      }
    );
    let reference = helpers.generateOTP()+"renew";
    const createTransaction = await models.transaction.create(
      {
        id:uuid.v4(),
        userId:transaction.userId,
        transactionType:"credit",
        amount:parseInt(payload.eventData.amount),
        time:payload.eventData.completedOn,
        status:"Success",
        reference:reference
      }
    );
    const wallet = await models.wallet.findOne(
      {
        where:{
          userId:transaction.userId
        }
      }
    );
    await models.wallet.update(
      {
        accountBalance:parseInt(wallet.accountBalance) + parseInt(payload.eventData.amount),
      },
      {
        where:{
          userId:transaction.userId,
        }
      }
    )
    responseData.message = "Success";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  }
}
module.exports = {
  getWalletBalance,
  webhook,
  flutterwaveWebhook,
  monnifyWebhook,
  monnifyEventWebhook
}