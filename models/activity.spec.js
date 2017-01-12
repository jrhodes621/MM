var expect    = require('chai').expect;
var Activity  = require('../models/activity');

describe('Activity', function(done) {
  it('should be invalid if bull is empty', function(done) {
      var activity = new Activity();

      activity.validate(function(err) {
        expect(err.errors.bull).to.exist;

        done();
      });
  });
  it('should be invalid if type is empty', function(done) {
      var activity = new Activity();

      activity.validate(function(err) {
        expect(err.errors.type).to.exist;

        done();
      });
  });
});
