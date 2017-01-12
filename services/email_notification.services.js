var postmark = require("postmark");

module.exports = {
  sendWelcomeEmail: function(calf, bull, callback) {
    var client = new postmark.Client(client_id);
    var from_address = "james@membermoose.com";
    var to_address = calf.email_address;
    var templateId = ""
    var templateModel = {
      "product_name": "MemberMoose",
      "name": user.first_name,
      "action_url": "https://signups.membermoose.com/confirm?id=12345",
      "username": user.email_address,
      "sender_name": "James Rhodes",
      "product_address_line1": "1657 W Broad St #3a",
      "product_address_line2": "Richmond, VA 23220"
    }

    client.sendEmailWithTemplate({
        "From": from_address,
        "To": to_address,
        "TemplateId": templateId,
        "TemplateModel": templateModel
    });
  },
  sendCalfSubscribeEmail: function(calf, bull, subscription, callback) {
    var client = new postmark.Client(client_id);
    var from_address = "james@membermoose.com";
    var to_address = calf.email_address;
    var templateId = ""
    var templateModel = {
      "product_name": "MemberMoose",
      "name": user.first_name,
      "action_url": "https://signups.membermoose.com/confirm?id=12345",
      "username": user.email_address,
      "sender_name": "James Rhodes",
      "product_address_line1": "1657 W Broad St #3a",
      "product_address_line2": "Richmond, VA 23220"
    }

    client.sendEmailWithTemplate({
        "From": from_address,
        "To": to_address,
        "TemplateId": templateId,
        "TemplateModel": templateModel
    });
  }
  sendCalfUnSubscribeEmail: function(calf, bull, subscription, callback) {

  },
  sendCalfPaymentSuccessEmail: function(calf, bull, charge, callback) {

  },
  sendCalfPaymentFailsEmail: function(calf, bull, charge, callback) {

  },
  sendBullSubscribedEmail: function(calf, bull, subscription, callback) {

  },
  sendBullUnSubcribeEmail: function(calf, bull, subscription, callback) {

  },
  sendBullaymentSuccessEmail: function(calf, bull, charge, callback) {

  },
  sendBullPaymentFailsEmail: function(calf, bull, charge, callback) {

  }
}
