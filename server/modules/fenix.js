const axios = require('axios');
const config = require('./config').fenix;

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
      status: true,
      campus: profile.campus,
      roles: profile.roles.map(a => a.type),
      displayName: profile.displayName,
      username: profile.username,
      mail: profile.email,
    };
  })
}

//TODO: function for refreshing token
Fenix.getRefreshToken = function(refreshToken) {

}

module.exports = Fenix;
