const auth = require('./lib/auth');
const leads = require('./lib/leads');
const utils = require('./lib/utils');

class VerizonThingSpace {
  constructor({ config }) {
    this.auth = new auth(config, this.setSessionToken, this.setAccessToken, this.setExpirationTime);
    this.leads = new leads(this.auth);
    this.utils = new utils(this.leads);
  }
}

module.exports = VerizonThingSpace;
