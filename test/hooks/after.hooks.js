var mongoose                  = require("mongoose");
var mockgoose                 = require('mockgoose');
var async                     = require("async");

var Hooks = {
  CleanUpDatabase: function(callback) {
    mockgoose.reset(function() {
      mongoose.connection.close();

      callback();
    });
  }
}

module.exports = Hooks
