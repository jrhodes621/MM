var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var ChargeFactory       = require("../test/factories/charge.factory.js");
var MembershipFactory   = require("../test/factories/membership.factory.js");
var PaymentCardFactory   = require("../test/factories/payment_card.factory.js");
var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

var User = require('../models/user');

describe("User Charges API Endpoint", function() {
  var bull = null;
  var bull_user = null;
  var json_web_token = null;
  var calf = null;

  beforeEach(function(done) {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function createBull(callback) {
        factory.create('account', function(err, account) {
          bull = account;

          callback();
        });
      },
      function createBullUser(callback) {
        factory.create('bull', function(err, user) {
          user.account = bull
          user.save(function(err) {
            bull_user = user;

            security.generate_token(bull_user, process.env.SECRET, function(err, token) {
              if(err) { console.log(err); }

              json_web_token = token;

              callback(err)
            });
          });
        });
      },
      function createUser(callback) {
        factory.create('user', function(err, user) {
          calf = user

          callback(err);
        })
      },
      function createMembership(callback) {
        factory.create('membership', {}, {
          calf: calf,
          bull: bull
        }, function(err, membership) {
          calf.memberships.push(membership);

          calf.save(function(err) {
            callback(err);
          });
        });
      },
      function createPaymentCard(callback) {
        factory.create('payment_card', function(err, payment_card) {
          calf.payment_cards.push(payment_card);

          calf.save(function(err) {
            callback(err);
          });
        });
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Get Charges", function() {
    it('should return a 200 when succeeds', function(done) {

      factory.createMany('charge', {}, 35,
        { "membership": calf.memberships[0],
          "payment_card": calf.payment_cards[0],
        }, function(err, charges) {
        request(app)
        .get('/api/users/' + calf._id + '/charges')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(35);

          done();
        });
      });
    });
    it('should return array of charges', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should only return charges for the current bull', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return a 200 when succeeds', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return 404 if calf is not member of bull', function(done) {
      done(new Error("Not Implemented"));
    });
  });
  describe("Create a One Time Charge", function() {
    it('should return a 201 when succeeds', function(done) {
      it('should return a 201 when succeeds', function(done) {
        let user = factory.buildSync('user');

        user.save(function(err) {
          if(err) { done(err); }

          security.generate_token(user, process.env.SECRET, function(err, token) {
            if(err) { done(err); }
            request(app)
            .post('/api/users/' + user._id + '/charges')
            .set('x-access-token', token)
            .send({
              "amount": "100.00",
              "currency": "usd",
              "description": "test charge"
            })
            .expect(201)
            .then((res) => {
              expect(res.body).to.be.an('object');

              done();
            });
          });
        });
      });
    });
    it('should return a 403 if bull is not connected to Stripe', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return a Stripe reference_id if connected to Stripe', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should call Stripe to create a charge', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return a charge json object', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should add a charge to the current user', function(done) {
      done(new Error("Not Implemented"));
    });
  });

});
