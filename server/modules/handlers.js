const Path = require('path');
const Config = require('./config')
const fenix = require('./fenix');

const Handlers = {}


Handlers.home = function(req, res) {
  res.sendFile(Path.resolve(__dirname + '/../../client/index.html'));
}

Handlers.adminLogin = function(req, res) {
  //TODO local system login for administrator
}

Handlers.userLogin = function(req, res) {
  return fenix.getAccessToken(req.query.code).then(function(data) {
    //Create cookie
    var cookie = {
      atk: data.access_token,
      rtk: data.refresh_token,
    }
    var options = {
      path: '/login/state',
      maxAge: 10000, //TODO: remove this parameter; only for test purposes cookies expires in 10 sec
      //expiration: 0 TODO: uncomment for session cookie
      signed: true, //signed cookie to verify integrity
      secure: false,
    }

    res.cookie('fwa-authorization', cookie, options)
    res.redirect('/')

  }).catch(error => { //Log error response
    console.log('\nERROR: ' + error.message + '\nDescription: ' + error.response.data.errorDescription + '\n') //Log error message
    return res.redirect('/login/error') //TODO redirect to error page
  });
}

//Get user status. Check for 'fwa-authorization' state cookie
//TODO: received error due to expired access token?  use refresh token : send error message
Handlers.loginStatus = function(req, res) {
  if(!req.signedCookies['fwa-authorization']){
    return res.send({ status: false });
  } else {
    return fenix.getPersonalInfo(req.signedCookies['fwa-authorization'].atk)
    .then(function(data){
      return res.send(data);
    }).catch(function(error) {
      //Log error message
      if(error.response) {
        console.log('\nERROR: ' + error.message + '\nDescription: ' + error.response.data.error_description + '\n')
      } else {
        console.log(error)
      }
      res.redirect('/login/error') //TODO redirect to error page
    })
  }
}

Handlers.loginError = function(req, res) {
  //TODO What to send when error occurs during authentication??
  return res.send('An error has ocurred !!')
}
//export 'Handlers' module
module.exports = Handlers;
