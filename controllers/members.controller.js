require('dotenv').config({ silent: true });

var Membership      = require('../models/membership');
var User            = require('../models/user');

var MembersController = {
  GetMembers: function(req, res, next) {
    var current_user = req.current_user;
    var page_size = 10;
    var page = req.query.page || 1;
    var offset = (page-1)*page_size;

    console.log(current_user.account);
    if(!current_user.account) { return next(new Error("No Members")); }
    // Map the docs into an array of just the _ids

    Membership.find({ 'account': current_user.account })
    .exec(function(err, memberships) {
      var ids = memberships.map(function(doc) { return doc.user; });

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
  },
  GetMember: function(req, res, next) {
    var user = req.current_user;

    if(!user.account.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.account.stripe_connect.access_token;

    StripeManager.getCustomer(stripe_api_key, req.params.member_id, function(err, member) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.send(member);
    });
  },
  CreateMember: function(req, res, next) {
    var current_user = req.current_user;

    var user = new User();
    user.email_address = req.body.email_address;
    user.password = "test123";
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.status = "Pending";
    user.roles = ['Calf'];

    user.save(function(err) {
      if(err) { return next(err); }

      current_user.members.push(user);
      current_user.save(function(err) {
        if(err) { return next(err); }

        res.status(201).send(user);
      });
    });
  }
}

module.exports = MembersController
