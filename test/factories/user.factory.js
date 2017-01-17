var factory = require('factory-girl');
var Account    = require('../../models/account');
var User    = require('../../models/user');

var AccountFactory    = require('../../test/factories/account.factory');

factory.define('user', User, function(buildOptions) {
  var user = {
    email_address: factory.sequence(function(n) {
      return 'user' + n + '@demo.com';
    }),
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
  // async functions can be used by accepting a callback as an argument
  // async: function(callback) {
  //   somethingAsync(callback);
  // },
  // you can refer to other attributes using `this`
  // username: function() {
  //   return this.email;
  // }
});
