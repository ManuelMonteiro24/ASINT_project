const Path = require('path');
const _ = require('underscore');
const dbconnect = require('./dbconnect');
const fenix = require('./fenix');


const Handlers = {}

Handlers.home = function(req, res) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.sendFile(Path.resolve(__dirname + '/../../client/index.html'));
}

//Authentication handler for system administrator
Handlers.adminLogin = function(req, res) {
  var authHeader = req.headers['authorization'];
  var parts = authHeader.split(' ');

  if(parts[0] === 'Basic') {
    var credentials = Buffer.from(parts[1], 'base64').toString().split(':') //decode from base64 to ascii and split username:password
    dbconnect.verifyAdminCredentials(credentials).then(function(verified) {
      if(!verified) {
        res.status(401).end() //401 unauthorized
      } else {
        var cookie = {
          ll: verified,
        }

        var options = {
          path: '/login/state',
          maxAge: 10000, //TODO: remove this parameter; only for test purposes cookies expires in 10 sec
          //expiration: 0 TODO: uncomment for session cookie
          signed: true, //signed cookie to verify integrity
          secure: false,
        }

        res.cookie('fwa-authorization-admin', cookie, options).end();
      }
    }).catch( err => {
      res.status(500).end(err.message)
    })
  }
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

    res.cookie('fwa-authorization', cookie, options).redirect('/')

  }).catch(error => { //Log error response
    if(error.response) {
      console.log('\nERROR: ' + error.message + '\nDescription: ' + error.response.data.error_description + '\n')
    } else {
      console.log(error)
    }
    return res.redirect('/login/error') //TODO error page
  });
}

//Get user status. Check for 'fwa-authorization' state cookie
//TODO: received error due to expired access token?  use refresh token : send error message
Handlers.loginStatus = function(req, res) {
  if(!req.signedCookies['fwa-authorization'] && !req.signedCookies['fwa-authorization-admin']){ //check for authorization cookies existance
    return res.send({ status: false });

  } else {
    if(req.signedCookies['fwa-authorization']){ //If it's user
      return fenix.getPersonalInfo(req.signedCookies['fwa-authorization'].atk)
      .then(function(data){
        res.send(data);
      }).catch(function(error) { //Log error message
        if(error.response) {
          console.log('\nERROR: ' + error.message + '\nDescription: ' + error.response.data.error_description + '\n')
        } else {
          console.log(error)
        }
        res.redirect('/login/error') //TODO error page
      });

    } else if(req.signedCookies['fwa-authorization-admin']){ //If it's admin
      return dbconnect.verifyAdminCookie(req.signedCookies['fwa-authorization-admin'].ll).then(function(verified) {
        if(verified) {
          res.send({ status: true, displayName: 'System Administrator', admin: true })
        } else {
          console.log('Handler: admin cookie rejected')
          res.status(401).end() //unauthorized
        }
      });
    }
  }
}

Handlers.loginError = function(req, res) {
  //TODO What to send when error occurs during authentication??
  return res.send('An error has ocurred !!')
}
//export 'Handlers' module
module.exports = Handlers;
