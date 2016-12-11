var request = require('request');
var Charge = require('../models/charge')
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager');
var ChargeHelper = require('./charge_helper');
var SubscriptionHelper = require('./subscription_helper')
var User = require('../models/user');
var Step = require('step');

module.exports = {
  process: function(stripe_event, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var reference_id = stripe_event.raw_object.customer;
    var invoice_id = stripe_event.raw_object.invoice;

    User.findOne({ "reference_id": reference_id})
    .exec(function(err, calf) {
      if(err) { callback(err, null); }
      if(!calf) { callback(new Error("Calf not found"), null) }

      //find invoice
      StripeManager.getInvoice(stripe_api_key, invoice_id, function(err, invoice) {
        var subscription_id = invoice.subscription;

        Subscription.findById(subscription_id)
        .populate('user')
        .populate('plan')
        .populate({
          path: 'plan',
          populate: [{
            path: 'user'
          }]
        })
        .exec(function(err, subscription) {
          console.log(subscription);
          //should include subscription that include plan
          //plan includes bull
          var activity = new Activity()

          activity.bull = subscription.plan.user;
          activity.calf = calf;
          activity.plan = subscription.plan;
          activity.type = "payment_processed";
          activity.mesage = "Your payment of $4.00 for Plan Name was successfully processed.";
          //activity.received_at =
          activity.source = "Stripe"

          activity.save(function(err) {
            callback(err, activity);
          });
        });
      });
    });
  });
