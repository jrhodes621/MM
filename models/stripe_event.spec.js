const expect = require('chai').expect;
const StripeEvent = require('../models/stripe_event');

describe('StripeEvent', () => {
  it('should be invalid if account is empty', (done) => {
    const stripeEvent = new StripeEvent();

    stripeEvent.validate((err) => {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if event_id is empty', (done) => {
    const stripeEvent = new StripeEvent();

    stripeEvent.validate((err) => {
      expect(err.errors.event_id).to.exist;

      done();
    });
  });
  it('should be invalid if type is empty', (done) => {
    const stripeEvent = new StripeEvent();

    stripeEvent.validate((err) => {
      expect(err.errors.type).to.exist;

      done();
    });
  });
  it('should be invalid if livemode is empty', (done) => {
    const stripeEvent = new StripeEvent();

    stripeEvent.validate((err) => {
      expect(err.errors.livemode).to.exist;

      done();
    });
  });
  it('should be invalid if raw object is empty', (done) => {
    const stripeEvent = new StripeEvent();

    stripeEvent.validate((err) => {
      expect(err.errors.raw_object).to.exist;

      done();
    });
  });
  it('should be invalid if processed is empty', (done) => {
    const stripeEvent = new StripeEvent();

    stripeEvent.processed = null;
    stripeEvent.validate(function(err) {
      expect(err.errors.processed).to.exist;

      done();
    });
  });
});
