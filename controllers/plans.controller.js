const Plan = require('../models/plan');
const StripeService = require('../services/stripe.services');

const PlansController = {
  GetPlans: (req, res, next) => {
    const currentUser = req.currentUser;
    const pageSize = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * pageSize;

    const params = {
      query: { account: currentUser.account, archive: false },
      paging: { offset, limit: pageSize, sort: { name: 'asc' } },
    };
    Plan.paginate(params.query, params.paging, (err, result) => {
      if (err) { return next(err); }

      return res.json({ results: result.docs,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        max_pages: Math.ceil(result.total / pageSize) });
    });
  },
  GetPlan: (req, res, next) => {
    const params = {
      plan_id: req.params.plan_id,
    };
    Plan.GetPlan(params, (err, plan) => {
      if (err) { return next(err); }
      if (!plan) { return res.status(404).send(new Error('Plan Not Found')); }

      res.send(plan);
    });
  },
  CreatePlan: (req, res, next) => {
    const user = req.currentUser;

    const plan = new Plan();

    plan.account = user.account._id;
    plan.name = req.body.name;
    plan.description = req.body.description;
    plan.features = req.body.features;
    plan.amount = req.body.amount;
    plan.interval = req.body.interval;
    plan.interval_count = req.body.interval_count;
    plan.statement_descriptor = req.body.statement_descriptor;
    plan.trial_period_days = req.body.trial_period_days || 0;
    plan.statement_description = req.body.statement_description;
    plan.terms_of_service = req.body.terms_of_service;

    Plan.SavePlan(plan, (err) => {
      if (err) { return next(err); }

      return res.status(201).send(plan);
      // user.plans.push(plan);
      // user.UpdateUser((err) => {
      //   console.log("using real");
      //   if(err) { return next(err); }
      //
      //   res.status(201).send(plan);
      // });
    });
    // if(user.account.stripe_connect) {
    //   const stripeApiKey = user.account.stripe_connect.access_token;
    //
    //   StripeService.createPlan(stripeApiKey, plan, function(err, stripe_plan) {
    //     if(err) { return next(err); }
    //
    //     plan.reference_id = stripe_plan.id;
    //
    //     plan.save((err) => {
    //       if(err) { return next(err); }
    //
    //       user.plans.push(plan);
    //
    //       user.save((err) => {
    //         if(err) { return next(err); }
    //
    //         if(req.file) {
    //           PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
    //             console.log(avatar_images);
    //             plan.avatar = avatar_images;
    //
    //             plan.save((err) => {
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
    //   plan.save((err) => {
    //     if(err) { return next(err); }
    //
    //     user.plans.push(plan);
    //
    //     user.save((err) => {
    //       if(err) { return next(err); }
    //
    //       if(req.file) {
    //         PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
    //           plan.avatar = avatar_images;
    //
    //           plan.save((err) => {
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
  UpdatePlan: (req, res, next) => {
    const currentUser = req.currentUser;
    const plan = req.plan;

    plan.name = req.body.name;
    plan.one_time_amount = req.body.one_time_amount;
    plan.description = req.body.description;
    plan.trial_period_days = req.body.trial_period_days;
    plan.features = req.body.features;
    plan.terms_of_service = req.body.terms_of_service;

    if (!currentUser.account.stripe_connect || !currentUser.account.stripe_connect.access_token) {
      Plan.SavePlan(plan, (err) => {
        if (err) { return next(err); }

        if (req.file) {
          Plan.uploadAvatar(plan, req.file.path, (avatarImages) => {
            plan.avatar = avatarImages;

            Plan.SavePlan(plan, (err) => {
              if (err) { return next(err); }

              return res.status(200).send(plan);
            });
          });
        } else {
          return res.status(200).send(plan);
        }
      });
    } else {
      const stripeApiKey = currentUser.account.stripe_connect.access_token;

      Plan.SavePlan(plan, (err) => {
        if (err) { return next(err); }

        StripeService.updatePlan(stripeApiKey, plan, (err, stripePlan) => {
          if (err) { return next(err); }

          if (req.file) {
            Plan.uploadAvatar(plan, req.file.path, (avatarImages) => {
              plan.avatar = avatarImages;

              Plan.SavePlan(plan, (err) => {
                if (err) { return next(err); }

                return res.status(200).send(plan);
              });
            });
          } else {
            return res.status(200).send(plan);
          }
        });
      });
    }
  },
  DeletePlan: (req, res, next) => {
    const currentUser = req.currentUser;
    const plan = req.plan;
    plan.archive = true;

    if (currentUser.account.stripe_connect.access_token) {
      const stripeApiKey = currentUser.account.stripe_connect.access_token;

      StripeService.deletePlan(stripeApiKey, plan, (err, confirmation) => {
        if (err) { return next(err); }

        Plan.save(plan, (err) => {
          if (err) { return next(err); }

          return res.sendStatus(202);
        });
      });
    } else {
      Plan.SavePlan(plan, (err) => {
        if (err) { return next(err); }

        return res.sendStatus(202);
      });
    }
  },
};

module.exports = PlansController;
