var ActivityHelper = require('../../helpers/activity_helper');
var ChargeHelper = require('../../helpers/charge_helper');
var MembershipHelper = require('../../helpers/membership_helper');
var StripeEventHelper = require('../../helpers/stripe_event_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');
const FormatCurrency = require('format-currency')

module.exports = {
  processCaptured: function(stripe_event, bull, callback) {
    let stripe_charge = stripe_event.raw_object.data.object;
    let charge_id = stripe_charge.id;
    let customer_id = stripe_charge.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);
    let payment_total = stripe_charge.amount;

    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    MembershipHelper.getMembershipByReference(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      ChargeHelper.getCharge(charge_id, membership, function(err, charge) {
        if(err) { return callback(err, null); }

        ChargeHelper.parseChargeFromStripe(charge,  membership, bull, stripe_charge, "captured", function(err, charge) {
          if(err) { return callback(err, charge); }

          var message_calf = "Your charge of " + payment_total_formatted + " was captured.";
          var message_bull= "A charge of " + payment_total_formatted + " from " + membership.user.email_address + " was captured.";

          StripeEventHelper.notifyUsers("charge_captured", bull, membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        })
      });
    });
  },
  processFailed: function(stripe_event, bull, callback) {
    let stripe_charge = stripe_event.raw_object.data.object;
    let charge_id = stripe_charge.id;
    let customer_id = stripe_charge.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);
    let payment_total = stripe_charge.amount;

    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    MembershipHelper.getMembershipByReference(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      ChargeHelper.getCharge(charge_id, membership, function(err, charge) {
        if(err) { return callback(err, null); }

        ChargeHelper.parseChargeFromStripe(charge, membership, bull, stripe_charge, "failied", function(err, charge) {
          if(err) { return callback(err, charge); }

          var message_calf = "Your charge of " + payment_total_formatted + " failed.";
          var message_bull= "A charge of " + payment_total_formatted + " from " + membership.user.email_address + " failed.";

          StripeEventHelper.notifyUsers("charge_failed", bull, membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        })
      });
    });
  },
  processPending: function(stripe_event, bull, callback) {
    let stripe_charge = stripe_event.raw_object.data.object;
    let charge_id = stripe_charge.id;
    let customer_id = stripe_charge.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);
    let payment_total = stripe_charge.amount;

    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    MembershipHelper.getMembershipByReference(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      ChargeHelper.getCharge(charge_id, membership, function(err, charge) {
        if(err) { return callback(err, null); }

        ChargeHelper.parseChargeFromStripe(charge, membership, bull, stripe_charge, "pending", function(err, charge) {
          if(err) { return callback(err, charge); }

          var message_calf = "Your charge of " + payment_total_formatted + " is pending.";
          var message_bull= "A charge of " + payment_total_formatted + " from " + membership.user.email_address + " is pending.";

          StripeEventHelper.notifyUsers("charge_pending", bull, membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        })
      });
    });
  },
  processRefunded: function(stripe_event, bull, callback) {
    let stripe_charge = stripe_event.raw_object.data.object;
    let charge_id = stripe_charge.id;
    let customer_id = stripe_charge.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);
    let payment_total = stripe_charge.amount;

    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    MembershipHelper.getMembershipByReference(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      ChargeHelper.getCharge(charge_id, membership, function(err, charge) {
        if(err) { return callback(err, null); }

        ChargeHelper.parseChargeFromStripe(charge, membership, bull, stripe_charge, "refunded", function(err, charge) {
          if(err) { return callback(err, charge); }

          var message_calf = "Your charge of " + payment_total_formatted + " was refunded.";
          var message_bull= "A charge of " + payment_total_formatted + " from " + membership.user.email_address + " was refunded.";

          StripeEventHelper.notifyUsers("charge_refunded", bull, membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        })
      });
    });
  },
  processSucceeded: function(stripe_event, bull, callback) {
    let stripe_charge = stripe_event.raw_object.data.object;
    let charge_id = stripe_charge.id;
    let customer_id = stripe_charge.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);
    let payment_total = stripe_charge.amount;

    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    MembershipHelper.getMembershipByReference(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      ChargeHelper.getCharge(charge_id, membership, function(err, charge) {
        if(err) { return callback(err, null); }

        ChargeHelper.parseChargeFromStripe(charge, membership, bull, stripe_charge, "succeeded", function(err, charge) {
          if(err) { return callback(err, charge); }

          var message_calf = "Your charge of " + payment_total_formatted + " was processed.";
          var message_bull= "A charge of " + payment_total_formatted + " from " + membership.user.email_address + " was processed.";

          StripeEventHelper.notifyUsers("charge_succeeded", bull, membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        })
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    let stripe_charge = stripe_event.raw_object.data.object;
    let charge_id = stripe_charge.id;
    let customer_id = stripe_charge.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);
    let payment_total = stripe_charge.amount;

    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    MembershipHelper.getMembershipByReference(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      ChargeHelper.getCharge(charge_id, membership, function(err, charge) {
        if(err) { return callback(err, null); }

        ChargeHelper.parseChargeFromStripe(charge, membership, bull, stripe_charge, charge.status, function(err, charge) {
          if(err) { return callback(err, charge); }

          var message_calf = "Your charge of " + payment_total_formatted + " was updated.";
          var message_bull= "A charge of " + payment_total_formatted + " from " + membership.user.email_address + " was updated.";

          StripeEventHelper.notifyUsers("charge_updated", bull, membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        })
      });
    });
  }
};
