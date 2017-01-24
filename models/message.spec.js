const expect = require('chai').expect;
const Message = require('../models/message');

describe('Message', () => {
  it('should be invalid if sender is empty', (done) => {
    const message = new Message();

    message.validate((err) => {
      expect(err.errors.sender).to.exist;

      done();
    });
  });
  it('should be invalid if recipient is empty', (done) => {
    const message = new Message();

    message.validate((err) => {
      expect(err.errors.recipient).to.exist;

      done();
    });
  });
  it('should be invalid if content is empty', (done) => {
    const message = new Message();

    message.validate((err) => {
      expect(err.errors.content).to.exist;

      done();
    });
  });
  it('should be invalid if viewed is empty', (done) => {
    const message = new Message();

    message.viewed = null;
    message.validate((err) => {
      expect(err.errors.viewed).to.exist;

      done();
    });
  });
  it('should be invalid if delivered push is empty', (done) => {
    const message = new Message();

    message.delivered_push = null;
    message.validate((err) => {
      expect(err.errors.delivered_push).to.exist;

      done();
    });
  });
  it('should be invalid if delivered email is empty', (done) => {
    const message = new Message();

    message.delivered_email = null;
    message.validate((err) => {
      expect(err.errors.delivered_email).to.exist;

      done();
    });
  });
});
