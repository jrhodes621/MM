var expect    = require('chai').expect;
var ChargeDispute   = require('../models/charge_dispute');

describe('Charge Dispute', function(done) {
  it('should be invalid if reference_id is empty', function(done) {
      var charge_dispute = new ChargeDispute();

      charge_dispute.validate(function(err) {
        expect(err.errors.reference_id).to.exist;

        done();
      });
  });
  it('should be invalid if charge is empty', function(done) {
      var charge_dispute = new ChargeDispute();

      charge_dispute.validate(function(err) {
        expect(err.errors.charge).to.exist;

        done();
      });
  });
  it('should be invalid if amount is empty', function(done) {
    var charge_dispute = new ChargeDispute();

      charge_dispute.validate(function(err) {
        expect(err.errors.amount).to.exist;

        done();
      });
  });
  it('should be invalid if dispute created is empty', function(done) {
    var charge_dispute = new ChargeDispute();

      charge_dispute.validate(function(err) {
        expect(err.errors.dispute_created).to.exist;

        done();
      });
  });
  it('should be invalid if is charge refundable is empty', function(done) {
    var charge_dispute = new ChargeDispute();
      charge_dispute.is_charge_refundable = null;

      charge_dispute.validate(function(err) {
        expect(err.errors.is_charge_refundable).to.exist;

        done();
      });
  });
  it('should be invalid if is reason is empty', function(done) {
    var charge_dispute = new ChargeDispute();

      charge_dispute.validate(function(err) {
        expect(err.errors.reason).to.exist;

        done();
      });
  });
  it('should be invalid if is status is empty', function(done) {
    var charge_dispute = new ChargeDispute();

      charge_dispute.validate(function(err) {
        expect(err.errors.status).to.exist;

        done();
      });
  });
});
