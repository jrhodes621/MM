require('dotenv').config({ silent: true });

var mongoose = require("mongoose");
var schedule = require('node-schedule');
var PersonalShopperRequestHelper = require('../helpers/personal_shopper_request_helper');
var PersonalShopperCheckInLedger = require('../models/personal_shopper_check_in_ledger');
var PersonalShopperCheckInHelper = require('../helpers/personal_shopper_check_in_helper');
var PersonalShopperRequest = require('../models/personal_shopper_request');

var db;
mongoose.connect(process.env.MONGODB_URI);

var personalShopperLedgerChecker = {
  scheduleJob: function() {
    // This rule is standard cron syntax for once per minute.
    // See http://stackoverflow.com/a/5398044/1252653
    var rule = '* * * * *'

    // Kick off the job
    var job = schedule.scheduleJob(rule, function() {
      console.log("start pruning checkin ledger");

      PersonalShopperCheckInHelper.purgePersonalShoppers(function() {
        console.log("finished pruning checking ledger");
      });
    });
  },

  init: function() {
    personalShopperLedgerChecker.scheduleJob();
  }
};
var checkPendingShoppingSessions = {
  scheduleJob: function() {
    console.log("scheduling job");
    //get pending personal shopper requests
    var THIRTY_SECONDS = 30 * 1000;
    var rule = '* * * * *'

    var job = schedule.scheduleJob(rule, function() {
      PersonalShopperRequest.find({'is_open': true}, function(err, requests) {
        if(err) {
          console.log(err);

          callback(null);
        }

        console.log(requests);

        requests.forEach(function(request) {
          if(request.createdAt < new Date() - THIRTY_SECONDS) {
            request.is_open = false;
            request.status = "Expired";

            request.save(function(err) {
              if(err) {
                console.log(err);

                return;
              }

              var shopping_session = request.shopping_session;

              //create a new personal shopper request for next personal shopper
              PersonalShopperCheckInHelper.getAvailablePersonalShoppers(shopping_session, function(personal_shoppers) {
                if(personal_shoppers.length == 0) {
                  //handle case where there are no personal shoppers
                } else {
                  personalShoppers.forEach(function(personal_shopper) {
                    if(personal_shopper != reuest.personal_shopper) {
                      PersonalShopperRequestHelper.createPersonalShopperRequest(shopping_session, personal_shopper, function(err, personal_shopper_request) {
                        if(err) {
                          console.log(err);

                          return;
                        } else {
                          var redisClient = require('redis').createClient(process.env.REDIS_URL);
                          var connectionDetails = { redis: redisClient };

                          var queue = new NR.queue({connection: connectionDetails}, jobs);
                          queue.on('error', function(error) { console.log(error); });
                          queue.connect(function(){
                            queue.enqueue('request_processor', "requestIt", [personal_shopper, shopping_session, personal_shopper_request]);

                            return;
                          });

                          redisClient.quit();
                        }
                      })
                    }
                  })
                }
              })
            })
          }
        })
      })
    });
  },
  init: function() {
    console.log("start check personal shopper requests");

    checkPendingShoppingSessions.scheduleJob();
  }
};
(function(){
  //personalShopperLedgerChecker.init();
  checkPendingShoppingSessions.init();
})();
