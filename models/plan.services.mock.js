var PlanFixtures = require('../fixtures/plan.fixtures')

var PlanServices = {
  GetPlans: function(params, callback) {
    callback(null, {
      "docs": PlanFixtures.paginated_results.plans,
      "limit": PlanFixtures.paginated_results.limit,
      "offset": PlanFixtures.paginated_results.offset,
      "total": PlanFixtures.paginated_results.total
    });
  },
  GetPlan: function(params, callback) {
    callback(null, PlanFixtures.plan);
  },
  SavePlan: function(plan, callback) {
    callback(null);
  },
  RemovePlan: function(callback) {
    callback(null)
  }
}

module.exports = PlanServices
