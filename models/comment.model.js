const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required: true
    },

    ticketId : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
        ref : 'Ticket'               // here 'Ticket' is refrence for another Ticket Model which name is Ticket.....
    },
     
    commenterId : {
        type : String,
        required : true,
    },
},

{
    timestamps : true,
    version : false
}
);

module.exports = mongoose.model('Comment', commentSchema);
