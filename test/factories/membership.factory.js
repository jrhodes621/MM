var factory     = require('factory-girl');
var faker       = require('faker');
var Membership  = require('../../models/membership');

factory.define('membership', Membership, function(buildOptions) {
  var membership = {
    account: buildOptions.bull._id,
    member_since: faker.date.past()
  }
  if(buildOptions.calf) {
    membership.user = buildOptions.calf._id
  } else {
    membership.user = factory.assoc('user', '_id');
  }
}, {
  afterCreate: function(instance, attrs, callback) {
    console.log("Instance " + instance);

    callback(null, instance);
  }
});
