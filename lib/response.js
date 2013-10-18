/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

/**
 * Expose `Response`.
 */

module.exports = Response;

/**
 * Initialize a new `Response`
 *
 *  - set flags (.ok, .error, etc)
 *  - parse metadata
 *
 * @param {Request} req
 * @param {Object} options
 * @constructor
 * @extends {EventEmitter}
 * @api private
 */

function Response(req, res, options) {
  options = options || {};
  this.req = req;
  this.res = res;
  this.links = (res.metadata ? res.metadata.links : null) || {};
  this.raw = res.raw;
  this.body = res.data;
  this.key = res.key || req.key;
  this.error = res.error;
  this.ok = !this.error;
  this.buffered = 'string' == typeof this.text;
  this.metadata = res.metadata;
  req.on('data', this.emit.bind(this, 'data'));
  req.on('end', this.emit.bind(this, 'end'));
  req.on('close', this.emit.bind(this, 'close'));
  req.on('error', this.emit.bind(this, 'error'));
};

/**
 * Inherits from `EventEmitter.prototype`.
 */

Response.prototype.__proto__ = EventEmitter.prototype;

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.metadata[field.toLowerCase()];
};

/**
 * Implements methods of a `ReadableStream`
 */

Response.prototype.destroy = function(err){
  this.res.destroy(err);
};

/**
 * Pause.
 */

Response.prototype.pause = function(){
  this.res.pause();
};

/**
 * Resume.
 */

Response.prototype.resume = function(){
  this.res.resume();
};
