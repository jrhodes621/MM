var factory     = require('factory-girl');
var faker       = require('faker');
var Membership  = require('../../models/membership');

factory.define('membership', Membership, function(buildOptions) {
  account: buildOptions.bull._id,
  member_since: faker.date.past()
}, {
  afterCreate: function(instance, attrs, callback) {
    console.log("Instance " + instance);

    callback(null, instance);
  }
});
