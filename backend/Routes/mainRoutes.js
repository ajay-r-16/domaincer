const express = require('express');
const router = express.Router();
const middleware = require('../Service/services')
const mongodb = require('mongodb');
const dotenv = require('dotenv');
const mongoClient = mongodb.MongoClient;
var nodemailer = require('nodemailer');

dotenv.config();
router.use(express.json());
router.use(middleware.authentication);


router.get("/getAllJobs", async (req,res)=>{
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db('Dream-JOb');
        let role = res.locals.role;
        if(role === "candidate"){
            let jobs = await db.collection('jobs').find({}).project({"applied_by":0}).toArray();
            let applied = await db.collection('Users').find({_id: mongodb.ObjectId(res.locals.user_id)},{projection:{applied_jobs:1}}).toArray();
            return res.status(200).json({jobs:jobs,applied:applied});
        }
        else{
            let jobs = await db.collection('jobs').find({posted_by: res.locals.user_id},{applied_by:0}).toArray();
            return res.status(200).send(jobs);
        }
    }
    catch(err){
        console.log(err);
    }
    mongo.close()
});

router.post("/postJob",async(req,res)=>{
    if(res.locals.role !=="recruiter"){
        return res.status(200).send("Request Forbidden");
    }
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db('Dream-JOb');
        req.body.posted_by = res.locals.user_id;
        req.body.applied_by = [];
        await db.collection('jobs').insertOne(req.body);
        return res.status(200).send("Job posted");
    }
    catch(err){
        console.log(err);
    }
    mongo.close()
});

router.get("/viewJob/:jobid", async (req,res)=>{
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db('Dream-JOb');
        let role = res.locals.role;
        if(role === "candidate"){
            return res.status(200).send("Request Forbidden");
        }
        else{
            let job_id = mongodb.ObjectId(req.params.jobid);
            let job = await db.collection('jobs').findOne({ _id: job_id,posted_by: res.locals.user_id});
            for(let i=0; i<job["applied_by"].length; i++){
                let user = await db.collection('Users').findOne({_id: mongodb.ObjectId(job["applied_by"][i]["id"])});
                job["applied_by"][i]["id"] = user;
            }
            return res.status(200).send(job);
        }
    }
    catch(err){
        console.log(err);
    }
    mongo.close()
});

router.put("/applyJob/:job_id",async(req,res)=>{
    if(res.locals.role !=="candidate"){
        return res.status(200).send("Request Forbidden");
    }
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db('Dream-JOb');
        let id = res.locals.user_id;
        let job_id = req.params["job_id"]
        
        await db.collection('Users').findOneAndUpdate({_id: mongodb.ObjectId(id)},{ $push: { applied_jobs : job_id}});
        let obj2 = {id: id, message: req.body.message, status:"Not reviewed"}
        await db.collection('jobs').findOneAndUpdate({_id: mongodb.ObjectId(job_id)},{ $push: { applied_by : obj2}})
        return res.status(200).send("Job Applied");
        
    }
    catch(err){
        console.log(err);
    }
    mongo.close()
});

router.put("/updateStatus",async (req,res)=>{
    if(res.locals.role !=="recruiter"){
        return res.status(200).send("Request Forbidden");
    }
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db('Dream-JOb');
        let id = req.body.id;
        let job_id = req.body.job_id

        let job = await db.collection('jobs').findOne({_id: mongodb.ObjectId(job_id)});
        
        for(let i=0; i<job["applied_by"].length; i++){
            if(job["applied_by"][i]["id"] === id){
                job["applied_by"][i]["status"] = req.body.status;
                break;
            }
        }
        await db.collection('jobs').findOneAndUpdate({_id: mongodb.ObjectId(job_id)},{ $set : {applied_by: job["applied_by"]}})
        return res.status(200).send("Status Updated");
        
    }
    catch(err){
        console.log(err);
    }
    mongo.close()
})

router.delete("/deleteJob/:job_id", async(req,res)=>{
    if(res.locals.role !=="recruiter"){
        return res.status(200).send("Request Forbidden");
    }
    let mongo;
    try{
        mongo = await mongoClient.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology: true});
        let db = mongo.db('Dream-JOb');
        let id = res.locals.user_id;
        let job_id = req.params["job_id"]

        await db.collection('jobs').deleteOne({_id: mongodb.ObjectId(job_id),posted_by: id});
        return res.status(200).send("Job Deleted");
        
    }
    catch(err){
        console.log(err);
    }
    mongo.close()

})

module.exports = router;