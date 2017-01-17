var Plan = require('./models/plan');
var PaymentCard = require('./models/payment_card');
var User = require('./models/user');

var Params = {
  GetPlan: function(req, res, next, plan_id) {
    Plan.findById(plan_id)
    .exec(function(err, plan) {
      if(err) { return next(err); }
      if(!plan) { return res.status(404).send({ error: new Error("Plan Not Found") }) }

      req.plan = plan;
      return next();
    });
  },
  GetUser: function(req, res, next, user_id) {
    User.findById(user_id)
    .exec(function(err, user) {
      if(err) { return next(err); }
      if(!user) { return res.status(404).send({ error: new Error("User Not Found") }) }

      req.user = user;

      return next();
    });
  }
}

module.exports = Params;
