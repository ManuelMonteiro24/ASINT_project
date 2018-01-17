const express = require('express');
const Handlers = require('./handlers');

var router = express.Router();

//Home route
router.get('/', Handlers.home);

//Login routes
router.get('/login/admin', Handlers.adminLogin);
router.get('/login/user', Handlers.userLogin);
router.get('/login/state', Handlers.loginStatus);
router.get('/login/error', Handlers.loginError);

module.exports = router;
