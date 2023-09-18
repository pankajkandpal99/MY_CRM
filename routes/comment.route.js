const commentController = require('../controller/comment.controller');
const authMiddleware = require('../middleware/authCheck.middleware');

module.exports = (app) => {
    app.post('/crm/api/v1/tickets/:ticketId/comments', authMiddleware.verifytoken, commentController.CreateComments);
    app.get('/crm/api/v1/tickets/:ticketId/comments', authMiddleware.verifytoken, commentController.fetchCommentsById);
}