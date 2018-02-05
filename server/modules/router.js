const express = require('express');
const Handlers = require('./handlers');

var router = express.Router();
var apiRouter = express.Router();

//Home route
router.get('/', Handlers.home);
//Login routes
router.get('/login/admin', Handlers.adminLogin);
router.get('/login/user', Handlers.userLogin);
router.get('/login/error', Handlers.loginError); //esta route nao devia ficar privada?? apenas entre o servidor???
router.get('/logout', Handlers.logout);

//API routes
apiRouter.use(Handlers.endpointAuthentication) //authentication middleware for /api routes

apiRouter.get('/state', Handlers.clientStatus);
apiRouter.get('/checkio/history', Handlers.checkIOHistory);
apiRouter.post('/checkio/in', Handlers.checkIn); //Room checkin endpoint
apiRouter.post('/checkio/out', Handlers.checkOut); //Room checkin endpoint
apiRouter.get('/rooms/find', Handlers.searchRooms);
apiRouter.get('/rooms/users', Handlers.checkedInUsers);
apiRouter.post('/rooms/:id/messages', Handlers.getRoomMessages);
apiRouter.put('/rooms/:id/messages', Handlers.putRoomMessage); //Write in database

module.exports = { apiRouter, router };
