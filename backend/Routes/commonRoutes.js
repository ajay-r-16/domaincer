const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongodb = require('mongodb');
const dotenv = require('dotenv');
const {sendCode, verifyCode} = require('../Service/twilioService');
router.use(express.json());
const jwt = require('jsonwebtoken');

const mongoClient = mongodb.MongoClient; 
dotenv.config();


router.post("/sendCode/:flag",async (req,res)=>{
    let mongo;
    try{
        let flag = req.params.flag;
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db("Dream-JOb");
        let user = await db.collection('Users').findOne({$or:[{email: req.body.email}, {mobile: req.body.phone}]});
        let phone;
        if(user){
            phone = user.mobile;
        }

        if(user && flag==="register"){
            return res.status(200).send("Account already exists");
        }

        if(!user && flag === "forgotPassword"){
            return res.status(200).send("Account doesn't exists");
        }
        
        sendCode(phone || req.body.phone).then((verification) => {
            return res.status(200).send({status: verification.status , phone: phone});
        });

    }
    catch(err){
        console.log(err);
    }
    mongo.close();

});


router.post("/verifyCode/:flag",(req,res)=>{
    let mongo;
    try{
        let flag = req.params.flag;
        verifyCode(req.body.details.mobile, req.body.code)
                .then(async verification_check => {
                    if(verification_check.status === "approved"){
                        
                        if(flag == "forgotPassword"){
                            return res.status(200).json({status: verification_check.status});
                        }
                        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
                        let db = mongo.db("Dream-JOb");
                        let salt = await bcrypt.genSalt(10);
                        let hash = await bcrypt.hash(req.body.details.password,salt);
                        req.body.details.password = hash;
                        let user = await db.collection('Users').insertOne(req.body.details);
                        let token = jwt.sign({id : user.ops[0]._id, role: user.ops[0].role}, process.env.JWT_KEY);
                        mongo.close();
                        return res.status(200).json({token:token, name: req.body.fullname, role: req.body.role, status: verification_check.status});
                        
                    }
                    // res.status(200).json({status: verification_check.status})
                });
    }
    catch(err){
        console.log(err);
    }
    
})


router.post('/login',async (req,res)=>{
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db("Dream-JOb");
        let user = await db.collection('Users').findOne({$or:[{email: req.body.username}, {mobile: req.body.username}]});

        if(!user){
            return res.status(200).send("Account doesn't exists");   
        }

        let isValid = await bcrypt.compare(req.body.password, user.password);

        if(isValid){
            let token = jwt.sign({id : user._id, role: user.role}, process.env.JWT_KEY);
            return res.status(200).json({token:token, name: user.fullname,  role: user.role});
        }
        return res.status(200).json({message: "Invalid username/password"});


    }
    catch(err){
        console.log(err);
    }
    mongo.close();
})


router.post('/updatePassword',async (req,res)=>{
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db("Dream-JOb");
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password,salt);
        req.body.password = hash;
        await db.collection('Users').findOneAndUpdate({mobile: req.body.phone},{$set:{password: req.body.password }});
        res.status(200).send("password updated");
    }
    catch(err){
        console.log(err);
    }
    mongo.close();
});




module.exports = router;