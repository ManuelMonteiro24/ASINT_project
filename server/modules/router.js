const express = require('express');
const Handlers = require('./handlers');

var router = express.Router();

//Home route
router.get('/', Handlers.home);

//Login routes
router.get('/login/admin', Handlers.adminLogin);
router.get('/login/user', Handlers.userLogin);
router.get('/login/error', Handlers.loginError);

router.get('/api/state', Handlers.clientStatus);
router.get('/api/checkio/history', Handlers.checkIOHistory);
//router.get('/api/checkio/in', Handlers.checkIn); //Room checkin endpoint
//router.get('/api/checkio/out', Handlers.checkOut); //Room checkout endpoint

module.exports = router;
