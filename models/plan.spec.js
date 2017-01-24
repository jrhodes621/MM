const expect = require('chai').expect;
const Plan = require('../models/plan');

describe('Plan', () => {
  it('should be invalid if account is empty', (done) => {
    const plan = new Plan();

    plan.validate((err) => {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if name is empty', (done) => {
    const plan = new Plan();

    plan.validate((err) => {
      expect(err.errors.name).to.exist;

      done();
    });
  });
  it('should be invalid if amount is empty', (done) => {
    const plan = new Plan();

    plan.validate((err) => {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if interval is empty', (done) => {
    const plan = new Plan();

    plan.validate((err) => {
      expect(err.errors.interval).to.exist;

      done();
    });
  });
  it('should be invalid if interval count is empty', (done) => {
    const plan = new Plan();

    plan.validate((err) => {
      expect(err.errors.interval_count).to.exist;

      done();
    });
  });
  it('should be invalid if trail period days is empty', (done) => {
    const plan = new Plan();

    plan.trial_period_days = null;
    plan.validate((err) => {
      expect(err.errors.trial_period_days).to.exist;

      done();
    });
  });
  it('should be invalid if archive is empty', (done) => {
    const plan = new Plan();

    plan.archive = null;
    plan.validate((err) => {
      expect(err.errors.archive).to.exist;

      done();
    });
  });
});
