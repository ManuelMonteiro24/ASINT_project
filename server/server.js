const Express = require('express');

const App = Express();

App.get('/', (req, res) => {
  res.send('Yo');
});

var listener = App.listen({ host: 'localhost', port: 3000 }, (err) => {
  if(err) { throw err; }
  console.log('Server listening @ ' + listener.address().address + ':' + listener.address().port);
});

module.exports = App;
