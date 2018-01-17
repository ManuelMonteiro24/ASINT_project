const Express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Path = require('path');

const config = require('./modules/config').server;
const Check = require('../models/checkio');
const User = require('../models/user');

const router = require('./modules/router');

const App = Express();

//Initialize App
App.use(cookieParser(config.auth.cookieSign))
App.use('/scripts', Express.static('scripts'));
App.use(router);


//TEST PURPOSES
App.get('/state', (req, res) => {
  User.find({ username: 'jasa' }, (err, doc) => {
    console.log(doc)
    if(!doc) {
      conseole.log('not doc');
    } else {
      /*doc[0].state = !doc[0].state;
      doc[0].save(/*{ state: !doc[0].get('state') } (err, data) => {
        if(err) throw err;
        console.log('updated');
      });*/
      doc[0].set('state', false)
    }
  });
});

var listener = App.listen(config.local, err => {
  if(err) { throw err; }

  var url = 'mongodb://'.concat(config.database.host + ':' + config.database.port) + '/local';
  mongoose.connect(url, { useMongoClient: true });

  console.log('Server listening @ ' + listener.address().address + ':' + listener.address().port);
});

module.exports = App;
