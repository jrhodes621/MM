var jwt    = require('jsonwebtoken');
var randtoken = require('rand-token')
var User = require('./models/user');

Security = {
  validate_token: function(token, secret, callback) {
    jwt.verify(token, secret, { header: 'JWT' }, function(err, decoded) {
      if (err) {
        if(err.name == 'TokenExpiredError') {
          return callback(new Error('Token Expired'), 401, 1001, null);
        } else {
          return callback(new Error('Failed to authenticate token.'), 403, 1002, null);
        }
      } else {
        // if everything is good, save to request for use in other routes
        //req.decoded = decoded;
        var user_id = decoded._id;

        User.findById(user_id)
        .populate('account')
        .populate('plans')
        .exec(function(err, user) {
          if (err) {
            return callback(new Error('Unable to Find User'), 403, 1003, null);
          }
          return callback(null, null, null, user);
        });
      }
    });
  },
  generate_token: function(user, secret, callback) {
    let token = jwt.sign({ _id: user._id }, secret, { expiresIn: 18000 });

    callback(null, token);
  }
}

module.exports = Security
