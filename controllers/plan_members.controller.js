const Plan = require('../models/plan');
const User = require('../models/user');

const PlanMembersController = {
  GetMembers: (req, res, next) => {
    const plan = req.plan;
    const pageSize = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * pageSize;

    Plan.findById(plan._id)
    .exec((err, plan) => {
      const ids = plan.members.map(doc => doc.user);

      User.paginate({ _id: { $in: ids } },
        { offset,
          limit: pageSize,
          sort: { last_name: 'asc',
            first_name: 'asc',
            email_address: 'asc',
          },
          populate: [{
            path: 'memberships',
            populate: {
              path: 'account',
            },
          }, {
            path: 'payment_cards',
          }, {
            path: 'charges',
          }, {
            path: 'memberships',
            populate: {
              path: 'subscriptions',
              populate: {
                path: 'plan',
                model: 'Plan',
              },
            },
          }],
        }, (err, result) => {
          if (err) { return next(err); }

          return res.json({ results: result.docs,
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            max_pages: Math.ceil(result.total / pageSize) });
        });
    });
  },
};

module.exports = PlanMembersController;
