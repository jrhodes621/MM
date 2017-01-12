var expect       = require('chai').expect;
var Plan         = require('../models/plan');

describe('Plan', function(done) {
  it('should be invalid if account is empty', function(done) {
    var plan = new Plan();

    plan.validate(function(err) {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if name is empty', function(done) {
    var plan = new Plan();

    plan.validate(function(err) {
      expect(err.errors.name).to.exist;

      done();
    });
  });
  it('should be invalid if amount is empty', function(done) {
    var plan = new Plan();

    plan.validate(function(err) {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if interval is empty', function(done) {
    var plan = new Plan();

    plan.validate(function(err) {
      expect(err.errors.interval).to.exist;

      done();
    });
  });
  it('should be invalid if interval count is empty', function(done) {
    var plan = new Plan();

    plan.validate(function(err) {
      expect(err.errors.interval_count).to.exist;

      done();
    });
  });
  it('should be invalid if trail period days is empty', function(done) {
    var plan = new Plan();

    plan.trial_period_days = null
    plan.validate(function(err) {
      expect(err.errors.trial_period_days).to.exist;

      done();
    });
  });
  it('should be invalid if archive is empty', function(done) {
    var plan = new Plan();

    plan.archive = null;
    plan.validate(function(err) {
      expect(err.errors.archive).to.exist;

      done();
    });
  });
});
