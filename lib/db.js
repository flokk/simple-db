/**
 * Module dependencies
 */
var util = require("./util")
  , parsers = require("./parsers")
  , proto = require("./proto");

/**
 * Database interface
 *
 * @param {String} name
 * @param {Object} adapter
 */
module.exports = function(name, adapter) {
  function db(method, bucket, key) { return db.request(method, bucket, key); };
  util.merge(db, proto);
  db._adapter = adapter;
  db._name = name;
  return db;
};

// expose the parsers
module.exports.parsers = parsers;
