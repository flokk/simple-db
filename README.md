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

#### get
```js
var db = require("simple-db")("riak");

db.get("food", "pizza")
  .end(function(err, res){
    console.log(res.body); // {name: "pizza", topings: ["pepperoni"]
  });
```

#### head
```js
db.head("food", "steak")
  .end(function(err, res){
    console.log(res.metadata); // {...}
  });
```

#### post
```js
db.post("food")
  .send({name: "casserole"})
  .end(function(res){
    console.log(res.key); // generated on the server
  });
```

#### put
```js
db.put("food", "burger")
  .send({name: "burger", toppins: ["tomatoes","cheese"]})
  .end(function(res){
    console.log(res.key); // burger
  });
```

#### remove
```js
db.remove("food", "broccoli")
  .end(function(res){
    console.log(res.ok) // true
  });
```

#### exists
```js
db.exists("food", "apple")
  .end(function(res){
    console.log(res.body) // false
  });
```

#### keys
```js
db.keys("food")
  .end(function(res){
    console.log(res.body) // ['pizza', 'steak', 'uuid', 'burger']
  })
```

#### count
```js
db.count("food")
  .end(function(res){
    console.log(res.body) // 3
  })
```

#### buckets
```js
db.buckets()
  .end(function(res){
    console.log(res.body) // ['food']
  })
```
