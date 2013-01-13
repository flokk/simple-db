var uuid = require('node-uuid');

module.exports = function() {

  var buckets = {},
      db = {};

  db.get = function(bucket, key, done) {
    done(null, 
      (buckets[bucket]&&buckets[bucket][key]?JSON.parse(JSON.stringify(buckets[bucket][key])):null)
    );
  };

  db.post = function(bucket, value, done) {

    var key = uuid.v4();
    db.put(bucket, key, value, function(err) {
      done(err, key);
    });
  };

  db.put = function(bucket, key, value, done) {
    if (!buckets[bucket]) buckets[bucket] = {};

    buckets[bucket][key] = JSON.parse(JSON.stringify(value));
    done(null);
  };

  db.remove = function(bucket, key, done) {
    if (!buckets[bucket]) buckets[bucket] = {};

    delete buckets[bucket][key];
    done(null);
  };

  db.all = function(bucket, done) {
    done(null,
      (buckets[bucket]?JSON.parse(JSON.stringify(buckets[bucket])):null)
    );
  };

  return db;
};
