const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

const stripe_event = {
"created": 1326853478,
"livemode": false,
"id": "evt_00000000000000",
"type": "invoice.updated",
"object": "event",
"request": null,
"pending_webhooks": 1,
"api_version": "2014-08-20",
"user_id": "acct_00000000000000",
"data": {
    "object": {
      "id": "in_19f9wC4IZxLlgOpCHk4Xm463",
      "object": "invoice",
      "amount_due": 1000,
      "application_fee": null,
      "attempt_count": 1,
      "attempted": true,
      "charge": "ch_19fDvX4IZxLlgOpCUQ5wVx7j",
      "closed": true,
      "currency": "usd",
      "customer": "cus_7PAmPpPQY5tLQ3",
      "date": 1485186056,
      "description": null,
      "discount": null,
      "ending_balance": 0,
      "forgiven": false,
      "lines": {
        "object": "list",
        "data": [
          {
            "id": "sub_7PAmXRfraOApjz",
            "object": "line_item",
            "amount": 1000,
            "currency": "usd",
            "description": null,
            "discountable": true,
            "livemode": false,
            "metadata": {},
            "period": {
              "start": 1485186039,
              "end": 1485790839
            },
            "plan": {
              "id": "Digg It Plan A",
              "object": "plan",
              "amount": 1000,
              "created": 1448281749,
              "currency": "usd",
              "interval": "week",
              "interval_count": 1,
              "livemode": false,
              "metadata": {},
              "name": "Digg It Plan A",
              "statement_descriptor": null,
              "trial_period_days": null,
              "statement_description": null
            },
            "proration": false,
            "quantity": 1,
            "subscription": null,
            "subscription_item": "si_18Suua4IZxLlgOpCVQyUaAvX",
            "type": "subscription"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/invoices/in_19f9wC4IZxLlgOpCHk4Xm463/lines"
      },
      "livemode": false,
      "metadata": {},
      "next_payment_attempt": null,
      "paid": true,
      "period_end": 1485186039,
      "period_start": 1484581239,
      "receipt_number": null,
      "starting_balance": 0,
      "statement_descriptor": null,
      "subscription": "sub_7PAmXRfraOApjz",
      "subtotal": 1000,
      "tax": null,
      "tax_percent": null,
      "total": 1000,
      "webhooks_delivered_at": 1485197788,
      "statement_description": null,
      "payment": "ch_19fDvX4IZxLlgOpCUQ5wVx7j"
    },
    "previous_attributes": {
      "attempted": false,
      "charge": null,
      "closed": false,
      "ending_balance": null,
      "next_payment_attempt": 1485189656,
      "paid": false,
      "payment": null
    }
  }
}
describe('Stripe Event API Endpoint', () => {
  let bull = null;

  beforeEach((done) => {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback);
      },
      function createAccount(callback) {
        factory.create('account', (err, account) => {
          account.reference_id = "acct_00000000000000";

          account.save((err) => {
            bull = account;

            callback();
          });
        });
      },
    ], (err) => {
      done(err);
    });
  });
  afterEach((done) => {
    AfterHooks.CleanUpDatabase((err) => {
      done(err);
    });
  });
  describe('Post Event from Stripe', () => {
    it('should return a 200 when succeeds', (done) => {
      request(app)
      .post('/api/stripe_events')
      .send(stripe_event)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('object');

        done();
      });
    });
  });
});
