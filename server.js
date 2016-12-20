'use strict';

var config = require('./config/index')
var logger
var server
var app
var router
var mongoose

/**
 * it inits application
 * init logger
 * start elasticsearch
 * start mongoose if configured
 */
exports.init = function (data) {
  data = data || {};
  config.merge(data);
  logger = require('./config/logger');
  require('./src/connections/elastic').init(config.get().elasticsearch);

  // run mongodb only when collection storage is set up to mongodb
  // don't run in test environment
  if (
    process.env.NODE_ENV !== 'test' &&
    config.get().collections &&
    config.get().collections.db === 'mongodb'
  ) {
    console.log('get get');
    //console.log(config.get().mongoose);

    if (data.mongoose) {
      /*var m = require('./config/mongoose').customConnect(
        config.get().mongodb.uri,
        config.get().mongodb.options
      )*/
      //console.log(m);
      //console.log(data.mongoose);
      require('./config/mongoose').setMongoose(data.mongoose)
      //console.log(require('./config/mongoose').getMongoose())
    } else if (config.get().mongodb) {
      require('./config/mongoose').customConnect(
        config.get().mongodb.uri,
        config.get().mongodb.options
      )
    }
  }

  app = require('./express').app;
  router = require('./express').router;
};

/**
 * any method should be called after init
 */
exports.get = function (name) {
  if (name === 'config') {
    return config.get();
  } else if (name === 'logger') {
    return logger;
  } else if (name === 'express') {
    return app;
  } else if (name === 'router') {
    return router;
  }
};

/**
 * start server
 */
exports.start = function start(done) {
  server = app.listen(config.get().server.port, function afterListen() {
    done(server);
  });
};

/**
 * stop server
 */
exports.stop = function stop(done) {
  server.close(function() {
    done();
  })
};

module.exports = exports;
