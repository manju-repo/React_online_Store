const jwt=require('jsonwebtoken');
const HttpError=require('../models/HttpError');
const auth2FA = require('../middleware/Auth2FA');

module.exports=(req, res, next)=>{
    if (req.method === 'OPTIONS') {
        return next();
      }
    try{
    console.log("in checkAuth");
        const token=req.headers.authorization.split(' ')[1];    //Authorization: 'Bearer TOKEN'
        console.log(token);
        if(!token){
            console.log('No token found');
            return res.status(401).json({success:false,message:'Authentication required'});
        }
        const decodedToken = jwt.verify(token,'supersecret_dont_share');
        //console.log('Token decoded', decodedToken);
        req.userData={ userId: decodedToken.userId , userType: decodedToken.userType, superAdmin: decodedToken.superAdmin};
        //console.log(req.userData);
        next();
    }catch(err){
        //const error=new HttpError('Authentication failed',401);
        //return next(error);
        console.error('Token verification failed', err);
       return res.status(401).json({success:false,message:'Authentication required'});
    }
}