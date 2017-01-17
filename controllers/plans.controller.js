var Plan = require('../models/plan');
var User = require('../models/user');

var StripeService = require('../services/stripe.services');

var PlansController = {
  GetPlans: function(req, res, next) {
    var current_user = req.current_user;
    var page_size = 10;
    var page = req.query.page || 1;
    var offset = (page-1)*page_size;

    var params = {
      query: { "account": current_user.account, "archive": false },
      paging: { offset: offset, limit: page_size, sort: { name: 'asc'} }
    }
    Plan.GetPlans(params, function(err, result) {
      if(err) { return next(err) };

      res.json({ results: result.docs, total: result.total, limit: result.limit, offset: result.offset, max_pages: Math.ceil(result.total/page_size) });
    });
  },
  GetPlan: function(req, res, next) {
    var params = {
      plan_id: req.params.plan_id
    }
    Plan.GetPlan(params, function(err, plan) {
      if(err) { return next(err); }
      if(!plan) { return res.status(404).send(new Error("Plan Not Found")); }

      res.send(plan);
    });
  },
  CreatePlan: function(req, res, next) {
    var user = req.current_user;

    var plan = new Plan();

    plan.account = user.account._id;
    plan.name = req.body.name;
    plan.description = req.body.description;
    plan.features = req.body.features;
    plan.amount =req.body.amount;
    plan.interval = req.body.interval;
    plan.interval_count = req.body.interval_count;
    plan.statement_descriptor = req.body.statement_descriptor;
    plan.trial_period_days = req.body.trial_period_days || 0;
    plan.statement_description = req.body.statement_description;
    plan.terms_of_service =req.body.terms_of_service;

    Plan.SavePlan(plan, function(err) {
      if(err) { return next(err); }

      res.status(201).send(plan);
      // user.plans.push(plan);
      // user.UpdateUser(function(err) {
      //   console.log("using real");
      //   if(err) { return next(err); }
      //
      //   res.status(201).send(plan);
      // });
    });
    // if(user.account.stripe_connect) {
    //   var stripe_api_key = user.account.stripe_connect.access_token;
    //
    //   StripeService.createPlan(stripe_api_key, plan, function(err, stripe_plan) {
    //     if(err) { return next(err); }
    //
    //     plan.reference_id = stripe_plan.id;
    //
    //     plan.save(function(err) {
    //       if(err) { return next(err); }
    //
    //       user.plans.push(plan);
    //
    //       user.save(function(err) {
    //         if(err) { return next(err); }
    //
    //         if(req.file) {
    //           PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
    //             console.log(avatar_images);
    //             plan.avatar = avatar_images;
    //
    //             plan.save(function(err) {
    //               if(err) { return next(err); }
    //
    //               res.status(201).json(plan);
    //             });
    //           });
    //         } else {
    //           res.status(201).json(plan);
    //         }
    //       });
    //     });
    //   });
    // } else {
    //   plan.save(function(err) {
    //     if(err) { return next(err); }
    //
    //     user.plans.push(plan);
    //
    //     user.save(function(err) {
    //       if(err) { return next(err); }
    //
    //       if(req.file) {
    //         PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
    //           plan.avatar = avatar_images;
    //
    //           plan.save(function(err) {
    //             if(err) { return next(err); }
    //
    //             res.status(201).json(plan);
    //           });
    //         });
    //       } else {
    //         res.status(201).json(plan);
    //       }
    //     });
    //   });
    // }
  },
  UpdatePlan: function(req, res, next) {
    var current_user = req.current_user;
    var plan = req.plan;

    plan.name = req.body.name;
    plan.one_time_amount = req.body.one_time_amount;
    plan.description = req.body.description;
    plan.trial_period_days = req.body.trial_period_days;
    plan.features = req.body.features;
    plan.terms_of_service = req.body.terms_of_service;

    if(!current_user.account.stripe_connect || !current_user.account.stripe_connect.access_token) {
      Plan.SavePlan(plan, function(err) {
        if(err) { return next(err); }

        if(req.file) {
          PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
            plan.avatar = avatar_images;

            Plan.SavePlan(plan, function(err) {
              if(err) { return next(err); }

              return res.status(200).send(plan)
            })
          });
        } else {
          return res.status(200).send(plan);
        }
      });
    } else {
      var stripe_api_key = current_user.account.stripe_connect.access_token;

      Plan.SavePlan(plan, function(err) {
        if(err) { return next(err); }

        StripeService.updatePlan(stripe_api_key, plan, function(err, stripe_plan) {
          if(err) { return next(err); }

          if(req.file) {
            PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
              plan.avatar = avatar_images;

              Plan.SavePlan(plan, function(err) {
                if(err) { return next(err); }

                res.status(200).send(plan)
              });
            });
          } else {
            res.status(200).send(plan);
          }
        });
      });
    }
  },
  DeletePlan: function(req, res, next) {
    var current_user = req.current_user;
    var plan = req.plan;
    plan.archive = true;

    if(current_user.account.stripe_connect.access_token) {
      var stripe_api_key = current_user.account.stripe_connect.access_token;

      StripeService.deletePlan(stripe_api_key, plan, function(err, confirmation) {
        if(err) { return next(err); }

        Plan.save(plan, function(err) {
          if(err) { return next(err); }

          res.sendStatus(202);
        });
      });
    } else {
      Plan.SavePlan(plan, function(err) {
        if(err) { return next(err); }

        res.sendStatus(202);
      });
    }
  }
}

module.exports = PlansController
