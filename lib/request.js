/**
 * Module dependencies
 */
var mime = require('mime')
  , methods = require("./methods")
  , parsers = require("./parsers")
  , Response = require("./response")
  , EventEmitter = require("events").EventEmitter
  , debug = require("debug")("simple-db:request");

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null != obj && 'object' == typeof obj;
}

/**
 * Define "msgpack" mime type.
 */

mime.define({
  'application/x-msgpack': ['msgpack', 'x-msgpack']
});

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String|Object} url
 * @api public
 */

function Request(adapter, method, bucket, key) {
  var self = this;
  this._adapter = adapter;
  if ('string' != typeof bucket) {key = bucket.key; bucket = bucket.bucket;}
  this.method = method;
  this.bucket = bucket;
  this.key = key;
  this.metadata = {};
  this.on('end', this.clearTimeout.bind(this));
  this.on('response', function(res){
    self.callback(null, res);
  });
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Request.prototype.__proto__ = EventEmitter.prototype;

/**
 * Set metadata `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('bucket', 'key')
 *        .set('content/type', 'application/json')
 *        .set('link', {bucket: "bucket", key: "key2"})
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({'content/type': 'application/json', 'link': {bucket: "bucket", key: "key2"} })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this.metadata[field] = val;
  return this;
};

/**
 * Get request meta `field`.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Request.prototype.get = function(field){
  return this.metadata[field];
};

/**
 * Set encoding-type response header passed through `mime.lookup()`.
 *
 * Examples:
 *
 *      request.post('bucket')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('bucket')
 *        .type('json')
 *        .send(jsonstring)
 *        .end(callback);
 *
 *      request.post('bucket')
 *        .type('application/json')
 *        .send(jsonstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.enctype = ~type.indexOf('/')
    ? type
    : mime.lookup(type);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('bucket')
 *         .type('json')
 *         .send('{"name":"cameron"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('bucket')
 *         .send({ name: 'cameron' })
 *         .end(callback)
 *
 *       // manual x-msgpack
 *       request.post('bucket')
 *         .type('msgpack')
 *         .send(msgpack.pack({name: 'cameron'}))
 *         .end(callback)
 *
 *       // auto x-msgpack
 *       request.post('user')
 *         .type('msgpack')
 *         .send({ name: 'cameron' })
 *         .end(callback)
 *
 *       // string defaults to appending
 *       request.post('user')
 *         .send('cameron')
 *         .send('testing')
 *         .send('123')
 *         .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.get('enctype');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  // string
  } else if ('string' == typeof data) {
    // default to text
    if (!type) this.type('text');
    type = this.get('enctype');

    this._data = (this._data || '') + data;
  } else {
    this._data = data;
  }

  if (!obj) return this;

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Enable / disable buffering.
 *
 * @return {Boolean} [val]
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.buffer = function(val){
  this._buffer = false === val
    ? false
    : true;
  return this;
};

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Define the parser to be used for this response.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.parse = function(fn){
  this._parser = fn;
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Initiate request, invoking callback `fn(err, res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this
    , data = this._data
    , req = new EventEmitter
    , buffer = this._buffer
    , method = this.method
    , timeout = this._timeout;

  // store callback
  this._callback = fn || noop;

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      var err = new Error('timeout of ' + timeout + 'ms exceeded');
      err.timeout = timeout;
      self._aborted = true;
      req.abort();
      self.callback(err);
    }, timeout);
  }

  // serialize stuff
  if ('string' != typeof data && method in methods.write) {
    var serialize = exports.serialize[self.get('enctype')];
    if (serialize) data = serialize(data);
  };

  // response
  req.on("response", function(res) {
    var mime = (res.metadata['enctype'] || '').split(/ *; */).shift()
      , type = mime.split('/')
      , subtype = type[0]
      , type = type[1];

    self.res = res;

    var parse = 'text' === type
      ? parsers.text
      : parsers[mime];

    // buffered response
    if (buffer) parse = parse || parsers.text;

    // explicit parser
    if (self._parser) parse = self._parser;

    // parse
    if (parse) {
      parse(req, res, function(err, obj){
        if(err) return self.emit("error", err);
        res.body = obj;
      });
    }

    // unbuffered
    if (!buffer) {
      var response = new Response(req, self.res);
      self.emit('response', response);
      return;
    }

    req.on('end', function(){
      var response = new Response(req, self.res);
      self.emit('response', response);
      self.emit('end');
    });

  });

  self._adapter(this, req);
  return this;
};

/**
 * Expose `Request`.
 */

module.exports = Request;
