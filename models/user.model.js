const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type :String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        default:"CUSTOMER"
    },
    userStatus:{
       type:String,
       default:"APPROVED"
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        immutable:true
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    ticketsCreated:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref : "Ticket"
    },
    ticketsAssigned:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref : "Ticket"
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;