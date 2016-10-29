
module.exports = {
  getMembership: function(user, company_name, callback) {
    console.log("getting membership for " + company_name);
    console.log(user);

    user.memberships.forEach(function(membership) {
      console.log(membership);
      callback(membership);
      // if(membership.company_name == company_name) {
      //   console.log("found membership");
      //   console.log(membership);
      //
      //   return membership;
      // }
    });
  },
  saveMemberships: function(memberships, callback) {
    var numberOfMemberships = memberships.length;

    if(numberOfMemberships == 0) {
      callback(null, []);
    }
    memberships.forEach(function(membership) {
      numberOfMemberships -= 1;

      membership.subscription.save(function(err) {
        if(err) { console.log(err); }

        if(numberOfMemberships == 0) {
          callback(err, memberships)
        }
      });
    });
  }
}
