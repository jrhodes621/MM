var expect      = require('chai').expect;
var Message  = require('../models/message');

describe('Message', function(done) {
  it('should be invalid if sender is empty', function(done) {
    var message = new Message();

    message.validate(function(err) {
      expect(err.errors.sender).to.exist;

      done();
    });
  });
  it('should be invalid if recipient is empty', function(done) {
    var message = new Message();

    message.validate(function(err) {
      expect(err.errors.recipient).to.exist;

      done();
    });
  });
  it('should be invalid if content is empty', function(done) {
    var message = new Message();

    message.validate(function(err) {
      expect(err.errors.content).to.exist;

      done();
    });
  });
  it('should be invalid if viewed is empty', function(done) {
    var message = new Message();

    message.viewed = null;
    message.validate(function(err) {
      expect(err.errors.viewed).to.exist;

      done();
    });
  });
  it('should be invalid if delivered push is empty', function(done) {
    var message = new Message();

    message.delivered_push = null;
    message.validate(function(err) {
      expect(err.errors.delivered_push).to.exist;

      done();
    });
  });
  it('should be invalid if delivered email is empty', function(done) {
    var message = new Message();

    message.delivered_email = null;
    message.validate(function(err) {
      expect(err.errors.delivered_email).to.exist;

      done();
    });
  });
});
