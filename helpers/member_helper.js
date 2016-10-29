var MembershipHelper  = require('./membership_helper');

module.exports = {
  saveMembers(members, callback) {
    var numberOfMembers = members.length;

    if(numberOfMembers == 0) {
      callback(null, []);
    }
    members.forEach(function(member) {
      numberOfMembers -= 1;

      member.save(function(err) {
        if(err) { console.log(err); }

        MembershipHelper.saveMemberships(member.memberships, function(err, memberships) {
          if(numberOfMembers == 0) {
            callback(err, members);
          }
        });
      });
    });
  }
}
