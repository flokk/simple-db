simple-db [![Build Status](https://travis-ci.org/flokk/simple-db.png)](https://travis-ci.org/flokk/simple-db)
=========

Simple bucket/key-value interface

```js
db
  .get("airplanes", "test")
  .meta({})
  .end(function(err, res){
    
  });
```
