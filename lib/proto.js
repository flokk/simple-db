/**
 * Module dependencies
 */

var methods = require('./methods');
var Request = require('./request');
var debug = require('debug')('simple-db');

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('get', 'bucket', 'key').end(callback)
 *    request('bucket', 'key').end(callback)
 *    request('bucket', 'key', callback)
 *    request('bucket', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

exports.request = function(method, bucket, key, fn) {
  debug(method, bucket, key);
  
  // request('method', bucket', 'key', fn)
  if ('function' == typeof fn) return new Request(this._adapter, method, bucket, key).end(fn);
  
  // request('bucket', 'key', fn)
  if ('function' == typeof key) return new Request(this._adapter, 'get', method, bucket).end(key);

  // request('bucket', fn)
  if ('function' == typeof bucket) return new Request(this._adapter, 'keys', method).end(bucket);

  // request(fn)
  if ('function' === typeof method) return new Request(this._adapter, 'buckets').end(method);

  // request('method', 'bucket', 'key')
  return new Request(this._adapter, method, bucket, key);
}

// generate db methods

Object.keys(methods).forEach(function(type){
  if (~type.indexOf('_')) return;

  methods[type].forEach(function(method) {
    exports[method] = function(bucket, key, fn){
      return this.request(method, bucket, key, fn);
    };
  });
});

// alias methods

Object.keys(methods._alias).forEach(function(method) {
  exports[method] = exports[methods._alias[method]];
});
