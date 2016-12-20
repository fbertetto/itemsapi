//var config = require('./index').get()
var mongoose

module.exports.customConnect = function(uri, options) {
  mongoose = require('mongoose')
  mongoose.Promise = require('bluebird')
  return mongoose.connect(uri, options)
}

module.exports.setMongoose = function(local) {
  console.log(local);
  console.log(mongoose);
  mongoose = local
}

module.exports.getMongoose = function() {
  return mongoose
}
