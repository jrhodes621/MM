var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;

var connections = require('./connections');

var Account = require('../../models/account');
var StripeImportProcessor = require('../../helpers/stripe_import_processor');

var SCRAPE_QUEUE = 'jobs.scrape';
var VOTE_QUEUE = 'jobs.vote';

function importFromStripe(data) {
  var account_id = data.account_id;

  //if(!bull) { return; } ToDo: We should handle this
  Account.findById(account_id, function(err, account) {
    console.log(account);
    StripeImportProcessor.processImport(account, function(err, imported_plans, imported_subscriptions, imported_charges, imported_coupons, imported_invoices) {
      console.log("finished importing " + imported_plans.count);
    });
  });
}
function App(config) {
  EventEmitter.call(this);

  this.config = config;
  this.connections = connections.createConnection(config.mongo_url, config.rabbit_url);
  this.connections.once('ready', this.onConnected.bind(this));
  this.connections.once('lost', this.onLost.bind(this));
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype = Object.create(EventEmitter.prototype);

App.prototype.onConnected = function() {
  var queues = 0;
  //this.Article = ArticleModel(this.connections.db, this.config.mongo_cache);
  //this.connections.queue.create(SCRAPE_QUEUE, { prefetch: 5 }, onCreate.bind(this));
  //this.connections.queue.create(VOTE_QUEUE, { prefetch: 5 }, onCreate.bind(this));

  this.connections.queue
    .default()
    .queue({ name: 'stripe_import_queue' })
    .consume(importFromStripe, { noAck: true });

  //function onCreate() {
    //if (++queues === 2)
    this.onReady();
  //}
};
App.prototype.onReady = function() {
  logger.log({ type: 'info', msg: 'app.ready' });
  this.emit('ready');
};

App.prototype.onLost = function() {
  logger.log({ type: 'info', msg: 'app.lost' });
  this.emit('lost');
};

App.prototype.startScraping = function() {
  console.log("start scraping");
  //this.connections.queue.handle(SCRAPE_QUEUE, this.handleScrapeJob.bind(this));
  //this.connections.queue.handle(VOTE_QUEUE, this.handleVoteJob.bind(this));
  return this;
};
