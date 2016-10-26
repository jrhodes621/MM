
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
  }
}
