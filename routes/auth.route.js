const userController = require('../controller/auth.controller');

module.exports = function(app){
    app.post('/crm/api/v1/auth/signup', userController.signup);
    app.post('/crm/api/v1/auth/signin', userController.signin);
}