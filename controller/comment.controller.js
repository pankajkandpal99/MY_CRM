const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');


// Customer/Engineer should be able to comment/reply on the ticket...........
exports.CreateComments = async(req, res)=>{
    const { ticketId } = req.params;
    const commentObj = {
        content : req.body.content,
        ticketId : ticketId,
        commenterId : req.userId
    }

    try { 
      const user = await User.findOne({userId : req.userId});
      if(user && user.userType === "ADMIN"){          // Check if the user is an ADMIN because only ENGINEER/CUSTOMER can do comments/reply.....
        return res.status(401).json({
            message: "You are not authorized for access this endpoint!"
        });
      }
      
      // if user is ENGINEER/CUSTOMER then check only asignee engineer or logged in customer is comment on this ticket....
      const ticket = await Ticket.findOne({_id : ticketId});
      if(!ticket){
        return res.status(404).json({
            message: `Ticket not Found with ticketId : ${req.params.ticketId}.`
        });
      }
    //   console.log(ticket.assignee);
    //   console.log(ticket.reporter);
      // Check if the current user is the assignee or the reporter of the ticket..
      if(ticket.assignee === req.userId || ticket.reporter === req.userId){
        const comments = await Comment.create(commentObj);

        res.status(200).json({
           content : comments.content,
           ticketId : comments.ticketId,
           commenterId : comments.commenterId,
           _id : comments._id,
           createdAt : comments.createdAt,
           updatedAt: comments.updatedAt
        });
      }
      else {
        return res.status(401).json({
            message : "You are not authorized to comment on this ticket!" 
         });
      }

    }catch(err){
        console.log("Error while creating comments : ", err);
        res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}



// API for fetching comments based on the ticket Id
exports.fetchCommentsById = async(req, res)=>{
    const { ticketId } = req.params;
    try {
        // ADMIN can't fetch the comments on the perticular tickets.....
        const user = await User.findOne({ userId : req.userId });
        if(user && user.userType === "ADMIN"){
           return res.status(401).json({
              message: "You are not authorized to access this endpoint!"
           });
        }

        const ticket = await Ticket.findOne({ _id : ticketId });
        if(!ticket){
            return res.status(404).json({
                message: `Ticket not found with your given ticketId : ${req.params.ticketId}.`
            });
        }
        
        // only assignee or reporter fetch the comments, assignee--- ticket is assigned to him, reporter-- ticket creator....
        if(ticket.assignee === req.userId || ticket.reporter === req.userId){
            const comments = await Comment.find({ticketId : ticketId});  
            if(!comments){
                return res.status(404).json({
                    message: `Comments not found with your given ticketId: ${req.params.ticketId}.`
                });
            }
    
            res.status(200).json(comments);
        }
        else {
            console.log("You are not authorized person to fetching the comments...");
            res.status(401).json({
                message: "You are not authorized to fetching the comments from this ticket!"
            });
        }

    } catch(err) {
         console.log("Error while fetching the comments by ticket Id : ", err);
         res.status(500).json({
             message: "Internal Server Error!"
         })
    }
}
