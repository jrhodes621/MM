var factory = require('factory-girl');
var Plan    = require('../../models/plan');

factory.define('plan', Plan, function(buildOptions) {
  var plan = {
    account: buildOptions.account._id,
    name: factory.sequence(function(n) {
      return 'Test Plan ' + n;
    }),
    interval_count: 1,
    interval: 2,
    amount: 100,
    reference_id: factory.sequence(function(n) {
      return 'Test Plan ' + n;
    }),
    archive: false,
    trial_period_days: 0
  }

  return plan;
  // async functions can be used by accepting a callback as an argument
  // async: function(callback) {
  //   somethingAsync(callback);
  // },
  // you can refer to other attributes using `this`
  // username: function() {
  //   return this.email;
  // }
});
