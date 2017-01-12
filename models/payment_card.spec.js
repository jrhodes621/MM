var expect       = require('chai').expect;
var PaymentCard  = require('../models/payment_card');

describe('Payment Card', function(done) {
  it('should be invalid if reference_id is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.validate(function(err) {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if brand is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.validate(function(err) {
      expect(err.errors.brand).to.exist;

      done();
    });
  });
  it('should be invalid if last4 is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.validate(function(err) {
      expect(err.errors.last4).to.exist;

      done();
    });
  });
  it('should be invalid if expiration month is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.validate(function(err) {
      expect(err.errors.exp_month).to.exist;

      done();
    });
  });
  it('should be invalid if expiration year is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.validate(function(err) {
      expect(err.errors.exp_year).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.validate(function(err) {
      expect(err.errors.status).to.exist;

      done();
    });
  });
  it('should be invalid if archive is empty', function(done) {
    var payment_card = new PaymentCard();

    payment_card.archive = null;
    payment_card.validate(function(err) {
      expect(err.errors.archive).to.exist;

      done();
    });
  });
});
