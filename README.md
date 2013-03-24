simple-db [![Build Status](https://travis-ci.org/flokk/simple-db.png)](https://travis-ci.org/flokk/simple-db)
=========

Simple bucket/key-value interface

Usage
-----

Register the adapter

```js
var simpleDB = require("simple-db")
  , riak = require("simple-db-riak");

simpleDB
  .register("riak", riak({
    host: "localhost",
    port: 1234
  }))
  .register("riak2", riak({
    host: "ec210-23-45-67.aws.com",
    port: 1234
  }));

```

Use it

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
