var Account               = require("../../models/account");
var Activity              = require("../../models/activity");
var Charge                = require("../../models/charge");
var ChargeDispute         = require("../../models/charge_dispute");
var Coupon                = require("../../models/coupon");
var Discount              = require("../../models/discount");
var Invoice               = require("../../models/invoice");
var Message               = require("../../models/message");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var Plan                  = require("../../models/plan");
var Subscription          = require("../../models/subscription");
var User                  = require("../../models/user");

var mongoose                  = require("mongoose");
var mockgoose                 = require('mockgoose');
var async                     = require("async");

var Hooks = {
  SetupDatabase: function(callback) {
    mockgoose(mongoose).then(function() {
        mongoose.connect('mongodb://localhost/membermoose_test', function(err) {
            callback(err);
        });
    });
  },
  SetupBull: function(bull_fixture, callback) {
    var bull = new Account(bull_fixture);

    bull.save(function(err) {
      if(err) { console.log(err); }

      callback(err, bull);
    });
  },
  SetupUser: function(user_fixture, callback) {
    var user = new User(user_fixture);

    user.save(function(err) {
      if(err) { console.log(err); }

      callback(err, user);
    });
  },
  SetupMembership: function(membership_fixture, user, bull, callback) {
    var membership = new Membership(membership_fixture);
    membership.user = user;
    membership.account = bull;
    membership.member_since = new Date();

    membership.save(function(err) {
      if(err) { console.log(err); }

      callback(err, membership);
    });
  },
  SetupPaymentCard: function(payment_card_fixture, user, callback) {
    var payment_card = new PaymentCard(payment_card_fixture);

    payment_card.save(function(err) {
      if(err) { console.log(err); }

      user.payment_cards.push(payment_card);

      callback(err, payment_card);
    });
  },
  SetupCharge: function(charge_fixture, user, membership, payment_card, callback) {
    var charge = new Charge(charge_fixture);

    charge.membership = membership;
    charge.payment_card = payment_card;
    charge.charge_created = new Date();

    charge.save(function(err) {
      if(err) { console.log(err); }

      user.charges.push(charge);

      callback(err, charge);
    });
  },
  SetupPlan: function(plan_fixture, bull, callback) {
    var plan = new Plan(plan_fixture);
    plan.account = bull;
    plan.save(function(err) {
      if(err) { console.log(err); }

      callback(err, plan);
    });
  },
  SetupSubscription: function(subscription_fixture, plan, membership, callback) {
    var subscription = new Subscription(subscription_fixture);

    subscription.plan = plan;
    subscription.membership = membership;
    subscription.subscription_created_at = new Date(); //ToDo: Implment

    subscription.save(function(err) {
      if(err) { console.log(err); }

      callback(err, subscription);
    });
  }
}

module.exports = Hooks
