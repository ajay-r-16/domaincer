
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

async function authentication(req,res,next){
    try{
      if(req.headers.authorization!==undefined){
        let decode = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY);
        
        if(decode !== undefined){
            res.locals.user_id = decode.id;
            res.locals.role = decode.role;
            next();
        }
        else{
          res.status(401).json({message : "invalid token"});
        }
      }
      else{
        res.status(401).json({message : "No token in header"});
      }
      
    }catch(error){
      console.log(error);
    }
}

module.exports = {authentication};