var Plan = require('../models/plan');
var User = require('../models/user');

var PlanMembersController = {
  GetMembers: function(req, res, next) {
    var current_user = req.current_user;
    var plan = req.plan;
    var page_size = 10;
    var page = req.query.page || 1;
    var offset = (page-1)*page_size;

    Plan.findById(plan._id)
    .exec(function(err, plan) {
      var ids = plan.members.map(function(doc) { return doc; });

      console.log(ids);
      User.paginate({ '_id': { $in: ids } }, { offset: offset, limit: page_size, sort: { last_name: 'asc', first_name: 'asc', email_address: 'asc' }, populate: [{
        path: 'memberships',
        populate: {
          path: 'account'
        }
      }, {
        path: 'payment_cards'
      }, {
        path: 'charges'
      }, {
        path: 'memberships',
        populate: {
          path: 'subscriptions',
          populate: {
            path: 'plan',
            model: 'Plan'
          }
        }
      }] }, function(err, result) {
        if(err) { return next(err) };

        res.json({ results: result.docs, total: result.total, limit: result.limit, offset: result.offset, max_pages: Math.ceil(result.total/page_size) });
      });
    });
  }
}

module.exports = PlanMembersController
