var expect        = require('chai').expect;
var Subscription  = require('../models/subscription');

describe('Subscription', function(done) {
  it('should be invalid if plan is empty', function(done) {
    var subscription = new Subscription();

    subscription.validate(function(err) {
      expect(err.errors.plan).to.exist;

      done();
    });
  });
  it('should be invalid if membership is empty', function(done) {
    var subscription = new Subscription();

    subscription.validate(function(err) {
      expect(err.errors.membership).to.exist;

      done();
    });
  });
  it('should be invalid if reference_id is empty', function(done) {
    var subscription = new Subscription();

    subscription.validate(function(err) {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if subscription created at is empty', function(done) {
    var subscription = new Subscription();

    subscription.validate(function(err) {
      expect(err.errors.subscription_created_at).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', function(done) {
    var subscription = new Subscription();

    subscription.validate(function(err) {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
