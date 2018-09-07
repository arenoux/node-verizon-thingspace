const got = require('got');
const moment = require('moment');

class VerizonAuth {
  constructor(config) {
    this.sessionToken = '';
    this.accessToken = '';
    this.expirationTime = '';
    this.BASE64_ENCODED_APP_KEY_AND_SECRET = Buffer(`${config.key}:${config.secret}`, 'binary').toString('base64');
    this.username = config.username;
    this.password = config.password;
  }

  getAuthenticatedHeaders() {
    return {
      'VZ-M2M-Token': this.sessionToken,
      Authorization: `Bearer ${this.accessToken}`
    };
  }

  async retrieveTokens() {
    const tokenResponse = await this.retrieveAccessToken();
    this.expirationTime = moment.valueOf() + tokenResponse.expires_in * 1000 - 60000;

    const sessionResponse = await this.retrieveSessionToken({
      username: this.username,
      password: this.password,
      access_token: tokenResponse.access_token
    });

    this.sessionToken = sessionResponse.sessionToken;
    this.accessToken = tokenResponse.access_token;
    return;
  }

  async ensureAuthenticated() {
    const inAMinute = moment().valueOf() + 60 * 1000;
    const expiredInTheNextMinute = !this.expirationTime || this.expirationTime < inAMinute;
    if (expiredInTheNextMinute) {
      await this.retrieveTokens();
    }
  }

  async retrieveAccessToken() {
    return await got
      .post('https://thingspace.verizon.com/api/ts/v1/oauth2/token', {
        body: { grant_type: 'client_credentials' },
        headers: {
          Authorization: `Basic ${this.BASE64_ENCODED_APP_KEY_AND_SECRET}`
        },
        form: true,
        json: true
      })
      .then(res => res.body);
  }

  async retrieveSessionToken({ username, password, access_token }) {
    return await got
      .post('https://thingspace.verizon.com/api/m2m/v1/session/login', {
        body: { username, password },
        headers: {
          Authorization: `Bearer ${access_token}`
        },
        json: true
      })
      .then(res => res.body);
  }
}

module.exports = VerizonAuth;
