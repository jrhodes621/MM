var Plan = require('./models/plan');
var PaymentCard = require('./models/payment_card');
var User = require('./models/user');

var Params = {
  GetPlan: function(req, res, next, plan_id) {
    console.log("Getting Plan for " + plan_id);

    Plan.findById(plan_id)
    .exec(function(err, plan) {
      if(err) { return next(err); }

      if(!plan) {
        return handleError(res, "Plan Not Found", "Plan Not Found.", 404);
      }
      req.plan = plan;

      return next();
    });
  },
  GetUser: function(req, res, next, user_id) {
    console.log("Getting User for " + user_id);

    User.findById(user_id)
    .exec(function(err, user) {
      if(err) { return next(err); }

      if(!user) {
        return handleError(res, "User Not Found", "Use Not Found.", 404);
      }
      req.user = user;

      return next();
    });
  }
}

module.exports = Params;
