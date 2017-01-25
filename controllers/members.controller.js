require('dotenv').config({ silent: true });

const Membership = require('../models/membership');
const User = require('../models/user');

const MembersController = {
  GetMembers: (req, res, next) => {
    const currentUser = req.currentUser;
    const pageSize = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * pageSize;

    if (!currentUser.account) { return next(new Error('No Members')); }
    // Map the docs into an array of just the _ids

    Membership.find({ account: currentUser.account })
    .exec((err, memberships) => {
      const ids = memberships.map(doc => doc.user);

      User.paginate({ _id: { $in: ids } },
        { offset,
          limit: pageSize,
          sort: { last_name: 'asc', first_name: 'asc', email_address: 'asc' },
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
  GetMember: (req, res, next) => {
    const user = req.currentUser;

    if (!user.account.stripe_connect.access_token) {
      return res.send([]);
    }
    const stripeApiKey = user.account.stripe_connect.access_token;

    StripeManager.getCustomer(stripeApiKey, req.params.member_id, (err, member) => {
      if (err) { return next(err); }

      return res.send(member);
    });
  },
  CreateMember: (req, res, next) => {
    const currentUser = req.currentUser;

    const user = new User();
    user.email_address = req.body.email_address;
    user.password = 'test123';
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.status = 'Pending';
    user.roles = ['Calf'];

    user.save((err) => {
      if (err) { return next(err); }

      currentUser.members.push(user);
      currentUser.save((err) => {
        if (err) { return next(err); }

        return res.status(201).send(user);
      });
    });
  },
};

module.exports = MembersController;
