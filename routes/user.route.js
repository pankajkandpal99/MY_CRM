const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/authCheck.middleware');

module.exports = function(app){
    app.get('/crm/api/v1/users/', [authMiddleware.verifytoken, authMiddleware.checkAdmin], userController.findAllUsers);
    app.get('/crm/api/v1/users/:userId', [authMiddleware.verifytoken, authMiddleware.checkAdmin], userController.UserById);
    app.put('/crm/api/v1/users/:userId',  [authMiddleware.verifytoken, authMiddleware.checkAdmin], userController.UpdateUser);
}