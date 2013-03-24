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

db.get("databases", "redis")
  .end(function(err, res){
    console.log(res.body); // {name: "Redis"}
  });
```

#### head
```js
db.head("databases", "redis")
  .end(function(err, res){
    console.log(res.metadata); // {...}
  });
```

#### post
```js
db.post("databases")
  .send({name: "Mongo"})
  .end(function(res){
    console.log(res.key); // generated on the server
  });
```

#### put
```js
db.put("databases", "riak")
  .send({name: "Riak"})
  .end(function(res){
    console.log(res.key); // riak
  });
```

#### remove
```js
db.remove("databases", "cassandra")
  .end(function(res){
    console.log(res.ok) // true
  });
```

#### exists
```js
db.exists("databases", "neo4j")
  .end(function(res){
    console.log(res.body) // false
  });
```

#### keys
```js
db.keys("databases")
  .end(function(res){
    console.log(res.body) // ['redis', 'uuid', 'riak']
  })
```

#### count
```js
db.count("databases")
  .end(function(res){
    console.log(res.body) // 3
  })
```

#### buckets
```js
db.buckets()
  .end(function(res){
    console.log(res.body) // ['databases']
  })
```
