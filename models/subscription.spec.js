const expect = require('chai').expect;
const Subscription = require('../models/subscription');

describe('Subscription', () => {
  it('should be invalid if plan is empty', (done) => {
    const subscription = new Subscription();

    subscription.validate((err) => {
      expect(err.errors.plan).to.exist;

      done();
    });
  });
  it('should be invalid if membership is empty', (done) => {
    const subscription = new Subscription();

    subscription.validate((err) => {
      expect(err.errors.membership).to.exist;

      done();
    });
  });
  it('should be invalid if subscription created at is empty', (done) => {
    const subscription = new Subscription();

    subscription.validate((err) => {
      expect(err.errors.subscription_created_at).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', (done) => {
    const subscription = new Subscription();

    subscription.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
