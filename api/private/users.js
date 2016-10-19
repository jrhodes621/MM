require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var Plan = require('../../models/plan');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeImportHelper = require('../../helpers/stripe_import_helper');

router.route('/connect_stripe')
  .post(function(req, res) {
    console.log("Connect Stripe");

    var user = req.user;
    user.stripe_connect = req.body.stripe_connect

    StripeImportHelper.importFromStripe(user, function(errors, plans) {
      numberOfPlans = plans.length;
      plans.forEach(function(plan) {

        plan.save(function(err) {
          numberOfPlans = numberOfPlans - 1;

          if(err) {
            console.log(err);
          } else {
            user.plans.push(plan);

            if(numberOfPlans == 0) {
              user.save(function(err) {
                if(err)
                  return res.status(400).send(err);

                res.status(200).json(user);
              });
            }
          }
        });
      })
    });
  });
router.route('/import_plans')
  .post(function(req, res) {
    console.log("Import Members");

    var user = req.user;
    var plansToImport = req.body.plans

    var numberOfPlans = plansToImport.length;
    plansToImport.forEach(function(planToImport) {
      Plan.findById(planToImport, function(err, plan) {
        numberOfPlans = numberOfPlans - 1;
        StripeImportHelper.importMembersFromPlan(user, plan, function(errors, members) {
          var numberOfMembers = members.length;

          members.forEach(function(member) {
            member.save(function(err) {
              numberOfMembers = numberOfMembers - 1;

              if(err) {
                if(numberOfMembers == 0  && numberOfPlans == 0) {
                  user.save(function(err) {
                    if(err) {
                      console.log(err)

                      return res.status(400).send(err);
                    }

                    res.status(200).json(user);
                  });
                }
              } else {
                member.subscriptions.forEach(function(subscription) {
                  subscription.save(function(err) {
                    if(err) {
                      console.log(err)
                    }
                    user.members.push(member);

                    if(numberOfMembers == 0  && numberOfPlans == 0) {
                      user.save(function(err) {
                        if(err) {
                          console.log(err)

                          return res.status(400).send(err);
                        }

                        res.status(200).json(user);
                      });
                    }
                  })
                })
              }
            });
          })
        });
      });
    });
  })
module.exports = router;
