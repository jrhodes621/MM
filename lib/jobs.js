var postmark = require("postmark");
var PushNotificationHelper = require("../helpers/push_notification_helper")

//////////////////////////////
// DEFINE YOUR WORKER TASKS //
//////////////////////////////
var jobs = {
  "slackIt": {
    perform: function(webhookUri, channel, username, text, callback) {
      var Slack = require('slack-node');

      slack = new Slack();
      slack.setWebhook(webhookUri);

      slack.webhook({
        channel: "#" + channel,
        username: username,
        text: text
      });

      callback(null, true);
    }
  },
  "emailIt": {
    perform: function(client_id, from_address, to_address, templateId, templateModel, callback) {
      // Example request
      var client = new postmark.Client(client_id);
      client.sendEmailWithTemplate({
          "From": from_address,
          "To": to_address,
          "TemplateId": templateId,
          "TemplateModel": templateModel
      });

      callback(null, true);
    }
  },
  "importChargesForUser": {
    perform: function(stripe_api_key, user, callback) {
      StripeImportHelper.importChargesForUser(stripe_api_key, user, function(err, user) {
        if(err) {
          console.log(err);

          callback(null, false);
        }
        user.save(function(err) {
          if(err) {
            console.log(err);

            callback(null, false);
          }

          callback(null, true);
        })
      })
    }
  }
};

module.exports = jobs;
