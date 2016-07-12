var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var PlanSchema   = new Schema({
  name: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Plan', PlanSchema);
