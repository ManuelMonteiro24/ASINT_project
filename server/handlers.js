const Path = require('path');
const Request = require('request');
const Config = require('./config')

const toExport = {}


toExport.home = function(req, res) {
  res.sendFile(Path.resolve(__dirname + '/../client/index.html'));
}

toExport.adminLogin = function(req, res) {

}

toExport.userLogin = function(req, res) {
  //verify access code
  var properties = {
    client_id: Config.auth.fenixClientId,
    client_secret: Config.auth.fenixClientSecret,
    redirect_uri: 'http://localhost:3000/login/user',
    code: req.query.code,
    grant_type: 'authorization_code',
  }

  return Request.post({url: Config.auth.fenixTokenUri, qs: properties}, function(err, resp, body) {
    if(err) throw err;
    //TODO: redirect to homepage with authorization cookie
    // authorization cookie can contain oauth access_token
    console.log(resp.statusCode);
    res.cookie('fwa-authorization', 'AUTHORIZED')
    res.redirect('/')
  });
}

//Retrieves user status: authenticated/unauthenticated
toExport.loginStatus = function(req, res) {
  console.log(req.cookies)
  if(!req.cookies){
    res.send({ status: false });
  } else {
    console.log(req.cookies['fwa-authorization']);
  }
  //TODO: check status by 'state' parameter
  //Check for the presence of 'fwa-authorization' cookie and, if present, check it's validity
}

//export 'Handlers' module
module.exports = toExport;
