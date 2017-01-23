var mongoose = require('mongoose');
var jackrabbit = require('jackrabbit');
var logger = require('logfmt');
var EventEmitter = require('events').EventEmitter;

var db = null;
function Connector(mongoUrl, rabbitUrl) {
  EventEmitter.call(this);

  var self = this;
  var readyCount = 0;

  mongoose.connect(mongoUrl)
  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', function () {
    logger.log({ type: 'info', msg: 'connected', service: 'mongodb' });
    ready();
  });

  // If the connection throws an error
  mongoose.connection.on('error',function (err) {
    logger.log({ type: 'error', msg: err, service: 'mongodb' });
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    logger.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
    lost();
  });

  // If the Node process ends, close the Mongoose connection
  // process.on('SIGINT', function() {
  //   mongoose.connection.close(function () {
  //     console.log('Mongoose default connection disconnected through app termination');
  //     process.exit(0);
  //   });
  // });
  //   .on('connected', function() {
  //
  //   })
  //   .on('error', function(err) {
  //     logger.log({ type: 'error', msg: err, service: 'mongodb' });
  //   })
  //   .on('close', function(str) {
  //     logger.log({ type: 'error', msg: 'closed', service: 'mongodb' });
  //   })
  //   .on('disconnected', function() {
  //     logger.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
  //     lost();
  //   });

  this.queue = jackrabbit(rabbitUrl)
    .on('connected', function() {
      logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
      ready();
    })
    .on('error', function(err) {
      logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
    })
    .on('disconnected', function() {
      logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
      lost();
    });

  function ready() {
    if (++readyCount === 2) {
      self.emit('ready');
    }
  }

  function lost() {
    self.emit('lost');
  }
};

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = {
  createConnection: function(mongoUrl, rabbitUrl) {
    return new Connector(mongoUrl, rabbitUrl);
  },
  db: db
}
