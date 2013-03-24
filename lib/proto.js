/**
 * Module dependencies
 */
var methods = require("./methods")
  , Request = require("./request")
  , debug = require("debug")("simple-db");

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('get', 'bucket', 'key').end(callback)
 *    request('bucket', 'key').end(callback)
 *    request('bucket', 'key', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

exports.request = function(method, bucket, key) {
  debug(method, bucket, key);
  // callback
  if ('function' == typeof key) {
    return new Request(this._adapter, 'get', method).end(key);
  }

  if (2 == arguments.length) {
    if ('function' === bucket) {
      // TODO
    }
    else {
      // bucket/key first
      return new Request(this._adapter, 'get', method, bucket);
    };
  }

  return new Request(this._adapter, method, bucket, key);
}

// generate db methods

Object.keys(methods).forEach(function(type){
  if(~type.indexOf("_")) return;
  methods[type].forEach(function(method) {
    exports[method] = function(bucket, key, fn){
      var req = this.request(method, bucket, key);
      fn && req.end(fn);
      return req;
    };
  });
});

// alias methods

Object.keys(methods._alias).forEach(function(method) {
  exports[methods._alias[method]] = exports[method];
});
