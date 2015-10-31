var winston = require('winston');
var should = require('should');
var setup = require('./../mocks/setup');
var assert = require('assert');

setup.makeSuite('project service', function() {

  var projectService = require('./../../src/services/project');
  var statsService = require('./../../src/services/stats');
  var elasticClient = require('./../../src/connections/elastic');

  it('should create project successfully', function(done) {
    projectService.addProject({
      projectName: 'test'
    }, function(err, res) {
      should.not.exist(err);
      done();
    });
  });

  it('should create collection with configuration', function(done) {
    var data = {
      projectName: 'test',
      collectionName: 'city'
    }

    projectService.ensureCollection(data, function(err, res) {
      should.not.exist(err);
      done();
    });
  });

  it('should create collection with configuration once again', function(done) {
    var data = {
      projectName: 'test',
      collectionName: 'city'
    }

    projectService.ensureCollection(data, function(err, res) {
      should.not.exist(err);
      done();
    });
  });

  it('should check collection info', function(done) {
    var data = {
      projectName: 'test',
      collectionName: 'city'
    }

    projectService.collectionInfoAsync(data)
    .then(function(res) {
      //should.not.exist(err);
      res.should.have.property('name', 'city');
      res.should.have.property('display_name');
      res.should.have.property('count');
      done();
    })
  });

  it('should fail when check collection info', function(done) {
    var data = {
      projectName: 'test',
      collectionName: 'notExisted'
    }

    projectService.collectionInfoAsync(data)
    .catch(function(res) {
      res.should.be.instanceOf(Error);
      done();
    })
  });

  it('should check stats', function(done) {
    statsService.statsAsync({
      projectName: 'test',
    })
    .then(function(res) {
      res.should.have.property('documents_count');
      res.should.have.property('collections_count');
      done();
    })
  });
});
