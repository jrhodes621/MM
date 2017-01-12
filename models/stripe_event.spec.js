var expect       = require('chai').expect;
var StripeEvent  = require('../models/stripe_event');

describe('StripeEvent', function(done) {
  it('should be invalid if account is empty', function(done) {
    var stripe_event = new StripeEvent();

    stripe_event.validate(function(err) {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if event_id is empty', function(done) {
    var stripe_event = new StripeEvent();

    stripe_event.validate(function(err) {
      expect(err.errors.event_id).to.exist;

      done();
    });
  });
  it('should be invalid if type is empty', function(done) {
    var stripe_event = new StripeEvent();

    stripe_event.validate(function(err) {
      expect(err.errors.type).to.exist;

      done();
    });
  });
  it('should be invalid if livemode is empty', function(done) {
    var stripe_event = new StripeEvent();

    stripe_event.validate(function(err) {
      expect(err.errors.livemode).to.exist;

      done();
    });
  });
  it('should be invalid if raw object is empty', function(done) {
    var stripe_event = new StripeEvent();

    stripe_event.validate(function(err) {
      expect(err.errors.raw_object).to.exist;

      done();
    });
  });
  it('should be invalid if processed is empty', function(done) {
    var stripe_event = new StripeEvent();

    stripe_event.processed = null;
    stripe_event.validate(function(err) {
      expect(err.errors.processed).to.exist;

      done();
    });
  });
});
