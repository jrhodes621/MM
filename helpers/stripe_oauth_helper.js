var request = require('request');

module.exports = {
  getAccessToken: function(client_secret, code, callback) {
    request.post(
      'https://connect.stripe.com/oauth/token', {
        form: {
          client_secret: client_secret,
          code: code,
          grant_type: "authorization_code",
        }
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(null, body);
        } else {
          callback(error, null);
        }
      }
    );
  }
};
