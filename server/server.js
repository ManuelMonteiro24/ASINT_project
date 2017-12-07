const Express = require('express');
const Path = require('path');

const App = Express();

//Initialize App
App.use('/scripts', Express.static('scripts'));

App.get('/', (req, res) => {
  res.sendFile(Path.resolve(__dirname + '/../client/index.html'));
});

var listener = App.listen({ host: 'localhost', port: 3000 }, (err) => {
  if(err) { throw err; }
  console.log('Server listening @ ' + listener.address().address + ':' + listener.address().port);
});

module.exports = App;
