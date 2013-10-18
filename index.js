/**
 * Module dependencies
 */

var util = require('./lib/util');
var parsers = require('./lib/parsers');
var proto = require('./lib/proto');

/**
 * Keep a list of registered databases
 */

var adapters = exports._adapters = {};

/**
 * Save the default adapter
 */

var defaultAdapter = null;

/**
 * Expose the adapters
 *
 * @param {String} name
 * @return {SimpleDbAdapter}
 */

module.exports = exports = function(name) {
  name = name || defaultAdapter;
  if (!adapters[name]) throw new Error('simple-db adapter "' + name + '" not initialized');
  return adapters[name];
};

/**
 * Register `adapter` by `name`
 *
 * @param {String} name
 * @param {SimpleDbAdapter} adapter
 * @return {simpleDb}
 */

exports.use = function(name, adapter) {
  adapters[name] = createDb(name, adapter);
  if (!defaultAdapter) defaultAdapter = name;
  return this;
};

/**
 * Set the default adapter
 *
 *     var simpleDb = require('simple-db')
 *       , riak = require('simple-db-riak');
 *     
 *     simpleDb.use('riak', riak(...));
 *     simpleDb.default('riak');
 *     
 *     var db = simpleDb(); // defaults to 'riak' adapter
 *
 * @param {String} name
 * @return {simpleDb}
 */

exports.default = function(name) {
  defaultAdapter = name;
  return this;
};

/**
 * Database interface
 *
 * @param {String} name
 * @param {Object} adapter
 * @api private
 */

function createDb(name, adapter) {
  function db(method, bucket, key, fn) { return db.request(method, bucket, key, fn); };
  util.merge(db, proto);
  db._adapter = adapter;
  db._name = name;
  return db;
};

// expose the parsers
exports.parsers = parsers;
