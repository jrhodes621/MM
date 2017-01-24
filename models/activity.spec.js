const expect = require('chai').expect;
const Activity = require('../models/activity');

describe('Activity', () => {
  it('should be invalid if bull is empty', (done) => {
    const activity = new Activity();

    activity.validate((err) => {
      expect(err.errors.bull).to.exist;

      done();
    });
  });
  it('should be invalid if type is empty', (done) => {
    const activity = new Activity();

    activity.validate((err) => {
      expect(err.errors.type).to.exist;

      done();
    });
  });
});
