const Express = require('express');
const mongoose = require('mongoose');
const Path = require('path');

const Config = require('./config.js');
const Check = require('../models/checkio.js');
const User = require('../models/user.js');

const App = Express();

//Initialize App
App.use('/scripts', Express.static('scripts'));


App.get('/', (req, res) => {
  //TEST PURPOSES
  //var doc = new Check({io: 'i', userId: 'jasaID', roomId: 'roomID'})
  var doc = new User({
    username: 'jasa',
    state: false,
  });
  doc.save( err => {
    if(err) {
      console.log('FUCK');
      throw err;
    }

  });
  doc.set('state', true)

  
  res.sendFile(Path.resolve(__dirname + '/../client/index.html'));
});

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

var listener = App.listen(Config.local, err => {
  if(err) { throw err; }

  var url = 'mongodb://'.concat(Config.database.host + ':' + Config.database.port) + '/local';
  mongoose.connect(url, { useMongoClient: true });

  console.log('Server listening @ ' + listener.address().address + ':' + listener.address().port);
});

module.exports = App;
