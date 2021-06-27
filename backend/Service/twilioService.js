const dotenv = require('dotenv');
dotenv.config();
let service_id = process.env.SERVICE_ID;

// import twilio helper class
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


sendCode = (phone)=>{
  return client.verify.services(service_id)
              .verifications
              .create({to: '+91'+phone, channel: 'sms'});
      
}

verifyCode = (phone,code)=>{
  return client.verify.services(service_id)
              .verificationChecks
              .create({to: '+91'+phone, code: code});
}


module.exports = { sendCode, verifyCode };


