const Express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Path = require('path');

const config = require('./modules/config').server;
const Router = require('./modules/router');
const dbconnect = require('./modules/dbconnect');

const App = Express();

//Initialize App
App.use(bodyParser.json())
App.use(cookieParser(config.auth.cookieSign))
App.use('/scripts', Express.static('scripts'));
App.use(Router.router);
App.use('/api', Router.apiRouter);

var listener = App.listen(config.local, err => {
  if(err) { throw err; }

  var url = 'mongodb://'.concat(config.database.host + ':' + config.database.port) + '/local';
  mongoose.connect(url); //send connection request to DB

  mongoose.connection.on('error', console.error.bind(console, 'mongo connection error:'))
  mongoose.connection.once('open', function() {
    dbconnect.defaultAdmin();
  });

  console.log('Server listening @ ' + listener.address().address + ':' + listener.address().port);
});

module.exports = App;
