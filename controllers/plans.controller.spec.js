const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Plans API Endpoint', () => {
  let bull = null;
  let bullUser = null;
  let jsonWebToken = null;

  beforeEach((done) => {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback);
      },
      function createAccount(callback) {
        factory.create('account', (err, account) => {
          bull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', (err, user) => {
          user.account = bull;
          user.save((err) => {
            if (err) { callback(err); }

            bullUser = user;

            security.generate_token(bullUser, process.env.SECRET, (err, token) => {
              if (err) { callback(err); }

              jsonWebToken = token;

              callback(err);
            });
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
  describe('Get Plans', () => {
    it('returns all plans', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        request(app)
        .get('/api/plans')
        .set('x-access-token', jsonWebToken)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array');
          expect(res.body.results).to.have.length(10);
          expect(res.body.total).to.equal(35);
          expect(res.body.limit).to.equal(10);
          expect(res.body.max_pages).to.equal(4);

          done();
        });
      });
    });
    it('paginates second page of results when passing page=2 in querystring', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        request(app)
        .get('/api/plans?page=2')
        .set('x-access-token', jsonWebToken)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array');
          expect(res.body.results).to.have.length(10);
          expect(res.body.offset).to.equal(10);

          done();
        });
      });
    });
    it('paginates third page of results when passing page=3 in querystring', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        request(app)
        .get('/api/plans?page=3')
        .set('x-access-token', jsonWebToken)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array');
          expect(res.body.results).to.have.length(10);
          expect(res.body.offset).to.equal(20);

          done();
        });
      });
    });
    it('paginates forth page of results when passing page=4 in querystring', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        request(app)
        .get('/api/plans?page=4')
        .set('x-access-token', jsonWebToken)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array');
          expect(res.body.results).to.have.length(5);
          expect(res.body.offset).to.equal(30);

          done();
        });
      });
    });
  });
  describe('Get Plan', () => {
    it('returns a plan', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        const plan = plans[2];

        request(app)
        .get('/api/plans/' + plan._id)
        .set('x-access-token', jsonWebToken)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.name).to.equal(plan.name);

          done();
        });
      });
    });
    it('returns a 404 if plan is not found', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        request(app)
        .get('/api/plans/587d092b6b16cf17b630205b')
        .set('x-access-token', jsonWebToken)
        .expect(404)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done();
        });
      });
    });
  });
  describe('Create Plan', () => {
    it('returns a new plan', (done) => {
      const newPlan = {
        name: 'Test Plan ABC',
        description: 'Best test plan for all',
        features: ['Feature 1', 'Feature 2'],
        amount: 100,
        currency: 'usd',
        interval: 1,
        interval_count: 3,
        statement_descriptor: 'Best Test Plan',
        trial_period_days: 0,
        statement_description: 'This is the statement descriptor',
        terms_of_service: 'Terms of Service',
      };

      request(app)
      .post('/api/plans/')
      .set('x-access-token', jsonWebToken)
      .send(newPlan)
      .expect(201)
      .then((res) => {
        const plan = res.body;

        expect(plan).to.be.an('object');
        expect(plan.name).to.equal(newPlan.name);
        expect(plan.description).to.equal(newPlan.description);
        expect(plan.feature).to.equal(newPlan.features);
        expect(plan.one_time_amount).to.equal(newPlan.one_time_amount);
        expect(plan.statement_descriptor).to.equal(newPlan.statement_descriptor);
        expect(plan.trial_period_days).to.equal(newPlan.trial_period_days);
        expect(plan.statement_description).to.equal(newPlan.statement_description);
        expect(plan.terms_of_service).to.equal(newPlan.terms_of_service);

        done();
      });
    });
  });
  describe('Update Plan', () => {
    it('returns a plan', (done) => {
      factory.createMany('plan', {}, 35, { account: bull }, (err, plans) => {
        const plan = plans[2];
        const planUpdates = {
          name: plan.name + ' updated',
          description: plan.description + ' updated',
          features: ['Feature 1', 'Feature 2'],
          one_time_amount: 101,
          //statement_descriptor: plan.statement_descriptor + ' updated',
          trial_period_days: 6,
          //statement_description: plan.statement_description + ' updated',
          terms_of_service: plan.terms_of_service + ' updated',
        };
        request(app)
        .put('/api/plans/' + plan._id)
        .set('x-access-token', jsonWebToken)
        .send(planUpdates)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.name).to.equal(planUpdates.name);
          expect(res.body.description).to.equal(planUpdates.description);
          expect(res.body.features).to.be.an('array');
          expect(res.body.one_time_amount).to.equal(planUpdates.one_time_amount);
          expect(res.body.statement_descriptor).to.equal(planUpdates.statement_descriptor);
          expect(res.body.trial_period_days).to.equal(planUpdates.trial_period_days);
          expect(res.body.statement_description).to.equal(planUpdates.statement_description);
          expect(res.body.terms_of_service).to.equal(planUpdates.terms_of_service);

          done();
        });
      });
    });
  });
});
