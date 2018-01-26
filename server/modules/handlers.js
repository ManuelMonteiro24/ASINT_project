const Path = require('path');
const _ = require('underscore');
const dbconnect = require('./dbconnect');
const fenix = require('./fenix');

const Handlers = {}

Handlers.endpointAuthentication = function(req, res, next) {
  if(!req.signedCookies['fwa-authorization'] && !req.signedCookies['fwa-authorization-admin']){ //check for authorization cookies existance
    console.log('Middleware: unauthorized api access to ', req.originalUrl)
    res.status(401).end() //unauthorized
  } else if(req.signedCookies['fwa-authorization']) {
    res.locals.admin = false;
    next()
  } else if(req.signedCookies['fwa-authorization-admin']) {
    dbconnect.verifyAdminCookie(req.signedCookies['fwa-authorization-admin'].ll).then(function(verified) {
      if(verified) {
        res.locals.admin = true;
        next()
      } else {
        console.log('Middleware: admin cookie rejected!')
        res.status(401).end() //unauthorized
      }
    });
  }
}

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
          path: '/api',
          maxAge: 30000, //TODO: remove this parameter; only for test purposes cookies expires in 10 sec
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
      path: '/api',
      maxAge: 60000, //TODO: remove this parameter; only for test purposes cookies expires in 10 sec
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

Handlers.logout = function(req, res) {
  res.clearCookie('fwa-authorization', { path: '/api', signed: true, secure: false })
  .clearCookie('fwa-authorization-admin', { path: '/api', signed: true, secure: false })
  .end()
}

Handlers.loginError = function(req, res) {
  //TODO What to send when error occurs during authentication??
  return res.send('An error has ocurred!')
}

//Get user status. Check for 'fwa-authorization' state cookie
Handlers.clientStatus = function(req, res) {
  if(res.locals.admin) { //If it's admin
    res.send({ displayName: 'System Administrator', admin: true })
  } else { //If it's user
    return fenix.getPersonalInfo(req.signedCookies['fwa-authorization'].atk).then(function(data){
      res.send(data);
    }).catch(function(error) { //Log error message
      if(error.response) {
        console.log('\nERROR: ' + error.message + '\nDescription: ' + error.response.data.error_description + '\n')
        fenix.getRefreshToken(req.signedCookies['fwa-authorization'].rtk).then(function(data){
          //Create cookie
          var cookie = {
            atk: data.access_token,
            rtk: req.signedCookies['fwa-authorization'].rtk,
          }

          var options = {
            path: '/api',
            maxAge: 60000, //TODO: remove this parameter; only for test purposes cookies expires in 10 sec
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
      } else {
        console.log(error)
      }
      res.redirect('/login/error') //TODO error page
    });
  }
}

Handlers.checkIOHistory = function(req, res) {
  if(res.locals.admin) {
    return dbconnect.verifyAdminCookie(req.signedCookies['fwa-authorization-admin'].ll).then(function(verified) {
      if(verified) {
        dbconnect.getCheckIOList().then(function(result) {
          res.send(result)
        });
      } else {
        console.log('Handler: admin cookie unverified')
        res.status(401).end() //unauthorized
      }
    });
  }
}

Handlers.searchRooms = function(req, res) {
  return dbconnect.searchCache(req.query.search).then(function(hit) {
    if(hit) { //If search it's a cache hit
      console.log('Handler: cache hit for query ', req.query.search)
      return res.send(hit.value)
    } else {
      return fenix.searchRooms(req.query.search).then(function(data) {
        dbconnect.cacheResults(req.query.search, data).then(function(success) {
          if(success){ console.log('Handler: room search results stored in cache') }
        }).catch(function(err) {
          console.log('Handlers: failed to cache results\n', err)
        })
        res.send(data);

      }).catch(function(error) { //Log error message
        if(error.response) {
          console.log('\nERROR: ' + error.message + '\nDescription: ' + error.response.data.error_description + '\n')
        } else {
          console.log(error)
        }
        res.redirect('/login/error') //TODO error page
      });
    }
  })
}

//export 'Handlers' module
module.exports = Handlers;
