/**
 * Module dependencies
 */
var debug = require("debug")("simple-db")
  , inherits = require("util").inherits
  , EventEmitter = require("events").EventEmitter;

/**
 * Database interface
 *
 * @param {String} name
 * @param {Object} adapter
 */
function db(name, adapter) {
  this.name = name;
  this.adapter = adapter;
};
inherits(db, EventEmitter);

// noop
function noop() {}

/**
 * Get the bucket/key value
 *
 * @param {String} bucket
 * @param {String} key
 * @param {Function} done
 */
db.prototype.get = function(bucket, key, done) {
  return this.performRequest("get", [bucket, key, done || noop]);
};

/**
 * Does bucket/key exist
 *
 * @param {String} bucket
 * @param {String} key
 * @param {Function} done
 */
db.prototype.exists = function(bucket, key, done) {
  return this.performRequest("exists", [bucket, key, done || noop]);
};

/**
 * Save the value to the database
 *
 * @param {String} bucket
 * @param {String} key
 * @param {Any} value
 * @param {Object} meta
 * @param {Function} done
 */
db.prototype.put =
db.prototype.save = function(bucket, key, value, meta, done) {
  if (typeof meta === "function") {
    done = meta;
    meta = {};
  };
  return this.performRequest("put", [bucket, key, value, meta || {}, done || noop]);
};

/**
 * Save the value to the database
 *
 * @param {String} bucket
 * @param {Any} value
 * @param {Object} meta
 * @param {Function} done
 */
db.prototype.post = function (bucket, value, meta, done) {
  if (typeof meta === "function") {
    done = meta;
    meta = {};
  }
  return this.performRequest("post", [bucket, value, meta || {}, done || noop]);
};

/**
 * Remove bucket/key
 *
 * @param {String} bucket
 * @param {String} key
 * @param {Function} done
 */
db.prototype.del =
db.prototype.delete =
db.prototype.remove = function(bucket, key, done) {
  return this.performRequest("remove", [bucket, key, done || noop]);
};

/**
 * Fetch all values in the bucket
 *
 * @param {String} bucket
 * @param {Function} done
 */
db.prototype.values =
db.prototype.all = function(bucket, done) {
  return this.performRequest("all", [bucket, done || noop]);
};

/**
 * Fetch all keys in the bucket
 *
 * @param {String} bucket
 * @param {Function} done
 */
db.prototype.keys = function(bucket, done) {
  return this.performRequest("keys", [bucket, done || noop]);
};

/**
 * Get the bucket size
 *
 * @param {String} bucket
 * @param {Function} done
 */
db.prototype.count = function(bucket, done) {
  return this.performRequest("count", [bucket, done || noop]);
};

/**
 * Perform request on the adapter
 */

db.prototype.performRequest = function(method, args) {
  var self = this;
  debug(method, args, "req");
  var done = args[args.length-1];
  args[args.length-1] = function(err) {
    if(err) return self.emit("error", err);
    debug(method, args, "res");
    done.apply(self, arguments);
    var arr = Array.prototype.slice.apply(arguments);
    // Replace the `err` object with `method`
    arr.splice(1,0,method);
    self.emit.call(self, arr);
  };
  self.adapter[method].apply(self.adapter, args);
  return self;
};

/**
 * Expose the interface
 */
module.exports = db;
