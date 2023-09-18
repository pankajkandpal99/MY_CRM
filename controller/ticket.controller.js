const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');

// create a new ticket--->>>>>>
exports.CreateTicket = async(req, res)=>{
    const {title, description} = req.body;
    if(!title || !description){
        return res.status(404).json({
            message: "Please provide mendatory fields!"
        });
    }
    const ticketObj = {
        title : req.body.title,
        description : req.body.description,
        ticketPriority : req.body.ticketPriority,
        status : req.body.status,
        reporter : req.userId,           //this will be retrieved from the middleware
    }

        const userType = 'ENGINEER'
        const userStatus = 'APPROVED'
        
        // Logic to find an Engineer in the Approved state 
        const engineer = await User.findOne({
            userType : userType,
            userStatus: userStatus
        });
        ticketObj.assignee = engineer.userId;

        if(!engineer){
           return res.status(404).json({
                message : "Engineer not found with Approved status! "
           });
        }

    try{  
        const ticket = await Ticket.create(ticketObj);

        if(ticket){
            const user = await User.findOne({userId : req.userId});
            // update the customer
            user.ticketsCreated.push(ticket._id);
            await user.save();

            // update the engineer
            engineer.ticketsAssigned.push(ticket._id);
            await engineer.save();

            res.status(200).json({
                id: ticket._id,
                title: ticket.title,
                description: ticket.description,
                ticketPriority : ticket.ticketPriority,
                status: ticket.status,
                reporter : ticket.reporter,
                assignee : ticket.assignee,
                createdAt : ticket.createdAt,
                updatedAt : ticket.updatedAt
            });
        }
    }catch(err){
        console.log(`Error while creating a ticket : `, err);
        res.status(500).json({
            message : "Internal Server Error!"
        });
    }
}


// get all request...tickets.....
exports.getAllTickets = async(req, res)=>{

    try{
        const allTickets = await Ticket.find();
        if(!allTickets){
            return res.status(404).json({
                message:"Ticket not found!"
            });
        }
        res.status(200).json(allTickets);

    } catch(err){
        console.log(`Error while fetching the Tickets : `, err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}

// get tickets by id-----
exports.getTicketsById = async (req, res)=>{
     const { ticketId } = req.params;
     try {
        const ticketById = await Ticket.findById({ _id : ticketId });
        if(!ticketById){
            return res.status(404).json({
                message : `Ticket Not found by this given Id : ${req.params}`
            });
        }

        res.status(200).json(ticketById);

     }catch(err){
        console.log('Error while fetching Tickets By Id : ', err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
     }
}


// Get all Ticketss filtered by status  ----------------
exports.getTicketByStatus = async(req, res)=>{
    try {
        const { ticketStatus } = req.query;
        if(!ticketStatus){
            return res.status(404).json({
                message: "Please provide the status for fetching the tickets!"
            });
        }

        const ticket = await Ticket.find({ status : ticketStatus });
        if(!ticket){
            return res.status(404).json({
                message: "Ticket not found for given your status"
            });
        } 
        res.status(200).json(ticket);
        
    } catch(err){
        console.log('Error while fetching Tickets By Status : ', err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}


/**
 * Update the ticket 
 * Only the user who has created the ticket should be allowed to update the ticket
 */
exports.UpdateTicket = async(req, res)=>{
    const { ticketId } = req.params;
    const {title, description, ticketPriority, status} = req.body;

    // validate ticket first ----
    if(!title){
        return res.status(400).json({
            message : "failed! title is not provided!"
        });
    }
    if(!description){
        return res.status(400).json({
            message : "failed! description is not provided!"
        });
    }

    try {
        const ticket = await Ticket.findOne({_id : ticketId});
        if(!ticket){
            return res.status(404).json({
                message :"Ticket not found which you want to update!"
            });
        }
        // check the userType---- customer , engineer or admin ???
        if(ticket.reporter == req.userId){    // req.userId means ki ise kewal wahi update kr sakta hai jo logged in ho ....
            // allowed to update 
            ticket.title = req.body.title != undefined ? req.body.title : ticket.title
            ticket.description = req.body.description != undefined ? req.body.description : ticket.description
            ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority
            ticket.status = req.body.status != undefined ? req.body.status : ticket.status

            const updatedTicket = await ticket.save();
            res.status(200).json({
                _id : updatedTicket._id,
                title : updatedTicket.title,
                ticketPriority : updatedTicket.ticketPriority,
                description : updatedTicket.description,
                status: updatedTicket.status,
                reporter : updatedTicket.reporter,
                assignee : updatedTicket.assignee,
                createdAt : updatedTicket.createdAt,
                updatedAt : updatedTicket.updatedAt,
            });
        }else{
             console.log("Ticket was being updated by someone who has not created the ticket");
             return res.status(401).json({
                message : "Ticket can be only by the customer who created it!"
             });
        }
    }catch(err){
        console.log(`Error while update the tickets : `, err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}



// API for authenticated Engineer to be able to see the complete list of tickets assigned to him/her...................
exports.AssignedToYouTickets = async(req, res)=>{
     try {
        const tickets = await Ticket.find({assignee : req.userId});
        if(tickets){
            return res.status(200).json(tickets);
        } else {
            return res.status(404).json({
                message : "No tickets are assigned to you!"
            });
        }
     }catch(err){
        console.log(`Error while checking the tickets assigned to engineer : `, err);
        res.status(500).json({
           message: "Internal Server Error!"
        });
     }
}


// API for Authenticated ENGINEERS to Search for the ticket By Id to assigned to him/her ...-----
exports.SearchTicketById = async(req, res)=>{
    try {
       const {ticketId} = req.params;
       const ticket = await Ticket.findOne({assignee : req.userId, _id : ticketId});
       if(!ticket){
            return res.status(404).json({
                message : `Ticket not Found with ticketId : ${req.params.ticketId}.`
            });
       }
       res.status(200).json(ticket);
    } catch(err){
        console.log("Error while fething tickets with Id..");
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}


// API for the authenticated Engineer to Update the ticket/reassign the ticket assigned to him/her...........
exports.UpdateTicketByEngineer = async(req, res)=>{
    const {ticketId} = req.params;
    const {title, ticketPriority, description, status} = req.body;

    if(!description){
        return res.status(400).json({
            message: "Please provide description to us!"
        });
    }
    if(!title){
        return res.status(400).json({
            message: "Please provide title to us!"
        });
    }
   
    try {
        const ticket = await Ticket.findOne({ _id: ticketId, assignee : req.userId,});
        if(!ticket){
            return res.status(404).json({
                message: "Ticket not found!"
            });
        }

        ticket.title = title != undefined ? title : ticket.title;
        ticket.ticketPriority = ticketPriority != undefined ? ticketPriority : ticket.ticketPriority;
        ticket.description = description != undefined ? description : ticket.description;
        ticket.status = status != undefined ? status : ticket.status;

        const updatedTicket = await ticket.save();
        res.status(200).json({
            _id : req.params.ticketId,
            title : updatedTicket.title,
            ticketPriority : updatedTicket.ticketPriority,
            description : updatedTicket.description,
            status: updatedTicket.status,
            reporter: updatedTicket.reporter,
            assignee : req.userId,
            createdAt : updatedTicket.createdAt,
            updatedAt : updatedTicket.updatedAt
        });

    }catch(err){
        console.log("Error while Updating the ticket : ", err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}


// API for the authenticated ADMIN to get the list of all the issues
exports.GetAllTicketByAdmin = async(req, res)=>{
    try {
        const tickets = await Ticket.find();
        if(!tickets){
            return res.status(404).json({
                message: "Tickets is not there!"
            });
        }
        res.status(200).json(tickets);
    }catch(err){
        console.log("Error while fething all issues : ", err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}


//API for the authenticated ADMIN to get the list of all the issues based on filters
exports.GetTicketByStatus = async(req, res)=>{
    const { ticketStatus } = req.query;
    try {
        const ticket = await Ticket.find({status : ticketStatus});
        if(!ticket){
            return res.status(404).json({
                message: `Ticket not found with your query status : ${req.query}.`
            });
        }

        res.status(200).json(ticket);

    }catch(err){
        console.log('Error while fetching the tickets by status : ', err);
        res.status(500).json({
            message: "Internal Server Error!"
        });
    }
}