const expect = require('chai').expect;
const PaymentCard = require('../models/payment_card');

describe('Payment Card', () => {
  it('should be invalid if reference_id is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.validate((err) => {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if brand is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.validate((err) => {
      expect(err.errors.brand).to.exist;

      done();
    });
  });
  it('should be invalid if last4 is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.validate((err) => {
      expect(err.errors.last4).to.exist;

      done();
    });
  });
  it('should be invalid if expiration month is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.validate((err) => {
      expect(err.errors.exp_month).to.exist;

      done();
    });
  });
  it('should be invalid if expiration year is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.validate((err) => {
      expect(err.errors.exp_year).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
  it('should be invalid if archive is empty', (done) => {
    const paymentCard = new PaymentCard();

    paymentCard.archive = null;
    paymentCard.validate((err) => {
      expect(err.errors.archive).to.exist;

      done();
    });
  });
});
