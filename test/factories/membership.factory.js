var factory     = require('factory-girl');
var faker       = require('faker');
var Membership  = require('../../models/membership');

factory.define('membership', Membership, function(buildOptions) {
  var membership = {
    user: buildOptions.calf._id,
    account: buildOptions.bull._id,
    member_since: faker.date.past()
  }

  return membership;
});
