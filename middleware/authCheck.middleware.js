const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const secret_key = require('dotenv').config();

exports.verifytoken = async(req, res, next)=>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.status(401).json({
            message:"Please login first!"
        });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded)=>{
        if(err){
            console.log("Error in your provided token! ", err);
            return res.status(401).json({
                message: "error occuring your token!"
            });
        }

        req.userId = decoded.id;
        next();
    });
}

// check specific user is Admin or not ????------
exports.checkAdmin = async(req, res, next)=>{
     try{
        const user = await User.findOne({userId : req.userId});
        if(user && user.userType === 'ADMIN'){
            next();
        } else {
            return res.status(401).json({
                message:"Only Admin can access this endpoint!"
            });
        }
     }catch(err){
        console.err("Error in your checking Admin condition! :", err);
        res.status(500).json({
            message:"Internal Server Error!"
        });
     }
}


exports.CheckEnginner = async(req, res, next)=>{
    try {
        const user = await User.findOne({userId : req.userId});
        if(user && user.userType === 'ENGINEER'){
            next();
        } else {
            return res.status(401).json({
                message: "You are not authorized to access this endpoint!"
            });
        }
    }catch(err){
         console.log(`Error while checking condition for user is Engineer or not !`);
         res.status(500).json({
            message : "Internal Server Error!"
         });
    }
}
