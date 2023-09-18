const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const validator = require('validator');
const bcrypt = require('bcrypt');

//  *  User signup-------------------------------------->>>>>>>>>>>>>>>>
exports.signup = async(req, res)=>{
  try{
     const {name, userId, email, password, userType} = req.body;
      
     if(!validator.isEmail(email)){           // email is valid or not ---
         return res.status(400).json({
            message:"Please enter valid email !"
         });
     }

    const existEmail = await User.findOne({email});   // email is exist or not ---
     if(existEmail){ 
        return res.status(200).json({
            message:"Email is already registered..."
        });
     }
     
     var userTypeReq = req.body.userType;
     var userStatusReq = "APPROVED";

     if(userTypeReq === "ENGINEER"){
        userStatusReq = "PENDING"
     }

     const user = await User.create({
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        userType: userTypeReq,
        userStatus: userStatusReq
     });
     res.status(201).json({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus
     });

  }catch(err){
       console.log("Error occuring in your signup request : ", err);
       res.status(500).json({
          message:"Internal Server Error!"
       });
  }
}


// signin ----->>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.signin = async(req, res)=>{
   try {
      const {userId, password} = req.body;
      const availableUser = await User.findOne({userId : userId});
      if(!availableUser){
         return res.status(404).json({
            message: "User not found!"
         });
      }

      if(availableUser.userStatus !== "APPROVED"){
         return res.status(400).json({
            message : `Can't login with status : ${availableUser.userStatus}.`
         });
      }

      if(!bcrypt.compareSync(password, availableUser.password)){
         return res.status(404).json({
            message:"please enter valid password!"
         });
      }

      const token = jwt.sign({id : availableUser.userId}, process.env.SECRET, {expiresIn:5000});
      res.status(200).json({
         name : availableUser.name,
         userId:availableUser.userId,
         email:availableUser.email,
         userType:availableUser.userType,
         userStatus:availableUser.userStatus,
         accessToken: token
      });
   }catch(err){
      console.log("Error occuring in your login request : ", err);
      res.status(500).json({
         message:"Internal Server Error!"
      });
   }
}
