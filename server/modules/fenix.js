const axios = require('axios');
const config = require('./config').fenix;
const _ = require('underscore');

const Fenix = {}

Fenix.getAccessToken = function(code) {

  var params = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code,
    grant_type: 'authorization_code',
  }

  //Request access_token with received access_code; Use token to authenticate user into the database
  return axios.post(config.accessTokenApi, {}, { params }).then(function(response) {
    return response.data;
  });
}

Fenix.getPersonalInfo = function(access_token) {
  var params = { access_token }
  return axios.get(config.personalInfoApi, { params }).then(function(response) {
    var profile = response.data;
    return {
      campus: profile.campus,
      roles: profile.roles.map(a => a.type),
      displayName: profile.displayName,
      username: profile.username,
      mail: profile.email,
    };
  })
}

Fenix.getRefreshToken = function(refreshToken) {
  var params = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }

  //Request new access_token with received refresh_token
  return axios.post(config.refreshTokenApi, {}, { params }).then(function(response) {
    return response.data;
  });
}

Fenix.searchRooms = function(search) {
  var base = config.spacesInfoApi
  var found = []

  //Recursive function for
  var recursiveQuery = function(param) {
    var uri = base
    if(param) { uri = uri + '/' + param }

    return axios.get(uri).then(function(resp) {
      var promises = []
      var _data

      if(resp.data.type === 'ROOM') {
         return resp.data
      } else {

        if(!Array.isArray(resp.data)) {
          _data = resp.data.containedSpaces
        } else {
          _data = resp.data
        }

        for(var i = 0; i < _data.length; i++) {
          if(_data[i].type !== 'ROOM' || (_data[i].type === 'ROOM' && _data[i].name.includes(search))) {
            promises.push(recursiveQuery(_data[i].id)) //recursive call
          }
        }
      }

      return Promise.all(promises)
    });
  }

  return recursiveQuery().then(function(resolves) {
    var ret = _.flatten(resolves)
    return _.compact(ret)
  })
}

module.exports = Fenix;
