var factory = require('factory-girl');
var faker = require('faker');
var Account    = require('../../models/account');
var User    = require('../../models/user');

var AccountFactory    = require('../../test/factories/account.factory');
var MembershipFactory    = require('../../test/factories/membership.factory');

factory.define('user', User, function(buildOptions) {
  var user = {
    email_address: faker.internet.email(),
    password: "test123",
    status: "active",
    roles: ["Calf"]
  }

  return user;
});
factory.define('bull', User, function(buildOptions) {
  var user = {
    email_address: factory.sequence(function(n) {
      return 'bull' + n + '@demo.com';
    }),
    password: "test123",
    status: "active",
    roles: ["Calf"]
  };

  return user;
});
