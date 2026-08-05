const Routes= require('express').Router()

const { login 

} = require('../controlers/login.controller');

Routes.post('/', login);

module.exports = Routes;