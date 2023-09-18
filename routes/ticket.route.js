const ticketController = require('../controller/ticket.controller');
const authCheck = require('../middleware/authCheck.middleware');

module.exports = function(app){
    app.post('/crm/api/v1/tickets/', authCheck.verifytoken, ticketController.CreateTicket);
    app.get('/crm/api/v1/tickets/', [authCheck.verifytoken, authCheck.checkAdmin], ticketController.getAllTickets);
    app.get('/crm/api/v1/tickets/:ticketId', [authCheck.verifytoken, authCheck.checkAdmin], ticketController.getTicketsById);
    app.get('/crm/api/v1/ticketStatus', [authCheck.verifytoken, authCheck.checkAdmin], ticketController.getTicketByStatus);
    app.put('/crm/api/v1/tickets/:ticketId', authCheck.verifytoken, ticketController.UpdateTicket);
    app.get('/crm/api2/v1/tickets/', [authCheck.verifytoken, authCheck.CheckEnginner], ticketController.AssignedToYouTickets);
    app.get('/crm/api2/v1/tickets/:ticketId', [authCheck.verifytoken, authCheck.CheckEnginner], ticketController.SearchTicketById);
    app.put('/crm/api2/v1/tickets/:ticketId', [authCheck.verifytoken, authCheck.CheckEnginner], ticketController.UpdateTicketByEngineer);
    app.get('/crm/api2/v2/tickets/', [authCheck.verifytoken, authCheck.checkAdmin], ticketController.GetAllTicketByAdmin);
    app.get('/crm/api2/v2/ticketStatus', [authCheck.verifytoken, authCheck.checkAdmin], ticketController.GetTicketByStatus);
}