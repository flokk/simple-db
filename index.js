/**
 * Module dependencies
 */
var db = require("./lib/db");

/**
 * Keep a list of registered databases
 */
var adapters = exports._adapters = {};

/**
 * Expose the adapters
 */
module.exports = exports = function(name) {
  if(!adapters[name]) throw new Error("simple-db adapter '"+name+"' not initialized");
  return adapters[name];
};

exports.register = function(name, adapter) {
  adapters[name] = db(name, adapter);
  return this;
};
