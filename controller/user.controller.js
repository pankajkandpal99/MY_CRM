const User = require('../models/user.model');

//  Fetch the list of users based on the filter of Status/UserType/Name
exports.findAllUsers = async(req, res)=>{
    let userNameReq = req.query.userName;
    let userStatusReq = req.query.userStatus;
    let userTypeReq = req.query.userType;
    
    var users;

    if(userNameReq){
        try {
            users = await User.find({ userName : userNameReq});
        } catch(err){
            console.err("error while fetching the user for userName : " + userNameReq);
            res.status(500).json({
                messsage:"Internal Server Error!"
            });
        }
    } else if(userStatusReq){
        try {
          users = await User.find({userStatus : userStatusReq})
        } catch(err){
            console.err("Error while fetching the user for userStatus : " + userStatusReq);
            res.status(500).json({
                message:"Internal Server Error!"
            });
        }
    } else if(userTypeReq){
        try {
           users = await User.find({userType : userTypeReq});
        } catch(err){
            console.err("Error while fetching the user for userTypeReq : " + userTypeReq);
            res.status(500).json({
                message:"Internal Server Error!"
            });
        }
    } else if(userTypeReq && userStatusReq){
        try {
           users = await User.find({userStatus:userStatusReq, userType:userTypeReq});
        } catch(err){
            console.err(`Error while fetching the user for userStatusReq : [${userStatusReq}] and userTypeReq : [${userTypeReq}]`);
            res.status(500).json({
                message:"Internal Server Error!"
            });
        }
    } else {
        try {
           users = await User.find();
        } catch(err){
            console.err("Error while fetching the users : ", err);
            res.status(500).json({
                message:"Internal Server Error!"
            });
        }
    }
    // Exclude users with "PENDING" status
    const filteredUser = users.filter(user => user.userStatus !== 'PENDING');    // isse pending status wale ka data nahi aayega..
    const newUser = filteredUser.map(user =>({
        name: user.userName,
        userId : user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus
    }));

    res.status(200).send(newUser);
}


//Get user based on the userID -------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.UserById = async(req, res)=>{
    try {
        const {userId} = req.params;
        const user = await User.findOne({userId:userId});
        if(!user){
            return res.status(404).json({
                message:"User not found!"
            });
        }
        res.status(200).json({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus
        });
    }catch(err){
        console.log(`Error connnecting while fetching the user for userId : ${req.params.userId}`);
        res.status(500).json({
            messagee:"Internal Server Error!"
        });
    }
}

// Update the user information- Type and Status---->>>>>>>>>>>>>>>>>>
exports.UpdateUser = async(req, res)=>{
    try {
        let {userId} = req.params;
        let {name,email, userType, userStatus} = req.body;
        if(!name || !userType || !userStatus){          // because update specially userType and userStatus, and we are updating other also..
            return res.status(200).json({
                message:"Please Provide all details to Update the particular User!"
            });
        }

        const user = await User.findOneAndUpdate({userId : userId}, req.body, {new: true});
        if(!user){
            return res.status(404).json({
                message:`User not found for updating profile : ${req.params.userId}.`
            });
        }

        res.status(200).json({
            updatedUser : {
                name : user.name,
                email : user.email,
                userId: user.userId,
                usertype : user.userType,
                userStatus: user.userStatus
            },
            message:"User updated Successfully..."
        });

    }catch(err){
        console.log('Error connecting while updating the user: ', err);
        res.status(500).json({
            messsage:"Internal Server Error!"
        });
    }
    
}