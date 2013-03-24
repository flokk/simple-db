simple-db [![Build Status](https://travis-ci.org/flokk/simple-db.png)](https://travis-ci.org/flokk/simple-db)
=========

Simple bucket/key-value interface

```js
db
  .get("airplanes", "123")
  .meta({links: {terminal: {bucket: "terminals", key: "L.A."}}})
  .end(function(err, res){
    
  });
```
