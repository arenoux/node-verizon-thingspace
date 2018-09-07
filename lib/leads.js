const _ = require('lodash');
const got = require('got');

class VerizonLeads {
  constructor(auth) {
    this.auth = auth;
  }

  async getLeads(aname, next) {
    let url = `https://thingspace.verizon.com/api/m2m/v1/leads/${aname}`;
    if (next) url += `?next=${next}`;

    await this.auth.ensureAuthenticated();

    const headers = _.assignIn(this.auth.getAuthenticatedHeaders(), {
      'Content-Type': 'application/json'
    });
    return await got
      .get(url, {
        headers,
        json: true
      })
      .then(res => res.body);
  }
}

module.exports = VerizonLeads;
