const _ = require('lodash');

class VerizonUtils {
  constructor(leads) {
    this.leads = leads;
  }

  async findLead(aname, leadId) {
    const getLeads = (aname, next) => {
      return this.leads.getLeads(aname, next);
    };

    return getLeads(aname).then(res => {
      const found = _.find(res.leads, { leadId });
      if (found) return found;
      if (res.hasMoreData) return this.findLead(aname, _.size(res.leads));
      return null;
    });
  }
}

module.exports = VerizonUtils;
