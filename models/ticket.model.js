const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title:{
       type : String,
       required: true
    },
    ticketPriority:{
       type : Number,
       default : 5         
    },
    description:{
       type : String,
       required: true
    },
    status:{
       type : String,
       required: true,
       default : "OPEN"
    },
    reporter:{
       type : String,
    },
    assignee:{
       type : String,
    },
    createdAt:{
        type:Date,
        immutable:true,
        default: ()=>{
         return Date.now();
       }
    },
    updatedAt:{
        type:Date,
        default: ()=>{
          return Date.now();
        }
    }
})

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;