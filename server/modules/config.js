module.exports = {
  server: {
    local: {
      host: 'localhost',
      port: 3000,
    },
    database: {
      host: 'localhost',
      port: 27017,
    },
    auth: {
      cookieSign: 'cooooooooookiesignature',
    },
  },
  fenix: {
    redirectUri: 'http://localhost:3000/login/user/',
    accessTokenApi: 'https://fenix.tecnico.ulisboa.pt/oauth/access_token',
    refreshTokenApi: 'https://fenix.tecnico.ulisboa.pt/oauth/refresh_token',
    personalInfoApi: 'https://fenix.tecnico.ulisboa.pt/api/fenix/v1/person',
    clientId: '1132965128044593',
    clientSecret: 'w+DRFx/9w7LexcwcZSZK7sCfcioy2bkHilr3ayz5imPZD6ClA2kSBx9OnmuTcq8DBgDfatDEBLvApM3Mhaj1sg==',
  },
}
