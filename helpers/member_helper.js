var MembershipHelper  = require('./membership_helper');
var SourceHelper      = require('./source_helper');
var Step = require('step');

module.exports = {
  saveMembers(plan, members, callback) {
    var numberOfMembers = members.length;

    if(numberOfMembers == 0) {
      callback(null, plan);
    }
    members.forEach(function(member) {
      member.save(function(err) {
        if(err) { console.log(err); }

        Step(
          function saveMemberships() {
            MembershipHelper.saveMemberships(member.memberships, this);
          },
          function doCallback(err, sources) {
            if(err) { console.log(err); }

            numberOfMembers -= 1;
            if(numberOfMembers == 0) {
              callback(err, plan);
            }
          }
        )
      });
    });
  }
}
