simple-db [![Build Status](https://travis-ci.org/flokk/simple-db.png)](https://travis-ci.org/flokk/simple-db)
=========

Simple bucket/key-value interface

Usage
-----

Adapters
--------

* [simple-db-memory](https://github.com/flokk/simple-db-memory)
* [simple-db-riak](https://github.com/flokk/simple-db-riak)
* [simple-db-redis](https://github.com/flokk/simple-db-redis)
* [simple-db-mongo](https://github.com/flokk/simple-db-mongo)

API
---

#### use

Register a connection and give it a name

```js
var simpleDB = require("simple-db")
  , riak = require("simple-db-riak")
  , redis = require("simple-db-redis")
  , mongo = require("simple-db-mongo");

simpleDB
  .use("riak", riak(process.env.RIAK_URL))
  .use("mongo", mongo("mongodb://user:pass@localhost/my-db"))
  .use("redis", redis({host: "...", port: 1234}));

```

#### default

Set the default adapter

```js
simpleDB
  .use("riak", riak(...))
  .use("mongo", riak(...));

simpleDB.default("mongo");

var db = simpleDB(); // db uses `mongo` adapter
var db2 = simpleDB("riak"); // db uses `riak` adapter
```

#### one-line

```js
var db = require("simple-db")("riak");
```

#### buckets
```js
db.buckets()
  .end(function(res){
    console.log(res.body) // ['food']
  })
```

#### count
```js
// db.count(bucket)
db.count("food")
  .end(function(res){
    console.log(res.body) // 3
  })
```

#### keys
```js
// db.keys(bucket)
db.keys("food")
  .end(function(res){
    console.log(res.body) // ['pizza', 'steak', 'burger-key']
  })
```

#### get
```js
// db.get(bucket, key)
db.get("food", "pizza")
  .end(function(err, res){
    console.log(res.body); // {name: "pizza", toppings: ["pepperoni"]}
  });
```

#### head
```js
// db.head(bucket, key)
db.head("food", "steak")
  .end(function(err, res){
    console.log(res.metadata); // {...}
  });
```

#### post
```js
// db.post(bucket)
db.post("food")
  .send({name: "casserole"})
  .end(function(res){
    console.log(res.key); // generated on the server
  });
```

#### put
```js
// db.put(bucket, key)
db.put("food", "burger-key")
  .send({name: "burger", toppings: ["tomatoes","cheese"]})
  .end(function(res){
    console.log(res.key); // burger-key
  });
```

#### remove
```js
// db.remove(bucket, key)
db.remove("food", "broccoli")
  .end(function(res){
    console.log(res.ok) // true
  });
```

#### exists
```js
// db.exists(bucket, key)
db.exists("food", "apple")
  .end(function(res){
    console.log(res.body) // false
  });
```

