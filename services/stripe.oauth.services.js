const request = require('request');

const StripeOAuthServices = {
  getAccessToken: (clientSecret, code, callback) => {
    request.post('https://connect.stripe.com/oauth/token', {
      form: {
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
      },
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(null, body);
      } else {
        callback(error, null);
      }
    });
  },
};

module.exports = StripeOAuthServices;
